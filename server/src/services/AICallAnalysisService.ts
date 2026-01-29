// server/src/services/AICallAnalysisService.ts
// Feature 4: AI-Powered Call Analysis with OpenAI GPT-4

import OpenAI from 'openai';
import Bull, { Queue, Job } from 'bull';
import { Call, ICall, IAISummary, IActionItem, ISentiment } from '../models/Call';
import { TranscriptionService } from './TranscriptionService';
import { RedisClient } from '../config/redis';
import { Logger } from '../utils/logger';

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

export interface AnalysisJobData {
    callId: string;
    transcriptText: string;
    contactName: string;
    accountName: string;
    userId: string;
    options?: AnalysisOptions;
}

export interface AnalysisOptions {
    model?: string;
    includeActionItems?: boolean;
    includeSentiment?: boolean;
    includeOpportunities?: boolean;
    language?: string;
}

export interface AIAnalysisResult {
    summary: string;
    keyPoints: string[];
    actionItems: Array<{
        description: string;
        priority: 'low' | 'medium' | 'high';
        suggestedDueDate?: string;
    }>;
    sentiment: {
        overall: 'positive' | 'neutral' | 'negative';
        score: number;
        highlights: {
            positive: string[];
            concerns: string[];
        };
    };
    topics: string[];
    nextSteps: string;
    opportunities: Array<{
        type: 'upsell' | 'cross-sell' | 'renewal' | 'new';
        description: string;
        estimatedValue?: number;
        probability?: number;
    }>;
}

// =============================================================================
// AI CALL ANALYSIS SERVICE
// =============================================================================

export class AICallAnalysisService {
    private openai: OpenAI;
    private analysisQueue: Queue<AnalysisJobData>;
    private transcriptionService: TranscriptionService;
    private logger: Logger;
    private defaultModel: string;

    constructor() {
        this.logger = new Logger('AICallAnalysisService');
        this.defaultModel = process.env.OPENAI_MODEL || 'gpt-4-turbo';

        // Initialize OpenAI client
        this.openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY
        });

        // Initialize transcription service
        this.transcriptionService = new TranscriptionService();

        // Initialize Bull queue for async processing
        this.analysisQueue = new Bull('ai-analysis-queue', {
            redis: RedisClient.getConfig(),
            defaultJobOptions: {
                attempts: 3,
                backoff: {
                    type: 'exponential',
                    delay: 10000
                },
                removeOnComplete: 50,
                removeOnFail: 200
            }
        });

        this.setupQueueHandlers();
    }

    // ===========================================================================
    // QUEUE HANDLERS
    // ===========================================================================

    private setupQueueHandlers(): void {
        this.analysisQueue.process('analyze-call', 2, async (job: Job<AnalysisJobData>) => {
            return this.processAnalysisJob(job);
        });

        this.analysisQueue.on('completed', (job: Job<AnalysisJobData>) => {
            this.logger.info('AI analysis completed', {
                jobId: job.id,
                callId: job.data.callId
            });
        });

        this.analysisQueue.on('failed', (job: Job<AnalysisJobData>, error: Error) => {
            this.logger.error('AI analysis failed', {
                jobId: job.id,
                callId: job.data.callId,
                error: error.message
            });
        });
    }

    // ===========================================================================
    // ANALYSIS PIPELINE
    // ===========================================================================

    public async analyzeCall(
        callId: string,
        options: AnalysisOptions = {}
    ): Promise<{ jobId: string; status: string }> {
        const call = await Call.findById(callId)
            .populate('contactId', 'firstName lastName')
            .populate('accountId', 'name')
            .lean<ICall & { contactId: { firstName: string; lastName: string }; accountId: { name: string } }>();

        if (!call) {
            throw new Error(`Call not found: ${callId}`);
        }

        if (call.transcript?.status !== 'completed') {
            throw new Error('Transcript not available for analysis');
        }

        // Mark as processing
        await Call.updateOne(
            { _id: callId },
            { 'aiSummary.status': 'processing' }
        );

        const jobData: AnalysisJobData = {
            callId,
            transcriptText: call.transcript?.text || '',
            contactName: `${call.contactId?.firstName || ''} ${call.contactId?.lastName || ''}`.trim(),
            accountName: call.accountId?.name || '',
            userId: call.userId.toString(),
            options
        };

        const job = await this.analysisQueue.add('analyze-call', jobData, {
            priority: options.includeOpportunities ? 1 : 2
        });

        return {
            jobId: job.id?.toString() || '',
            status: 'queued'
        };
    }

    private async processAnalysisJob(job: Job<AnalysisJobData>): Promise<IAISummary> {
        const { data } = job;
        const startTime = Date.now();

        this.logger.info('Processing AI analysis', {
            jobId: job.id,
            callId: data.callId
        });

        try {
            // Generate AI analysis
            const analysis = await this.generateAnalysis(
                data.transcriptText,
                data.contactName,
                data.accountName,
                data.options
            );

            // Build AI summary object
            const aiSummary: IAISummary = {
                status: 'completed',
                model: data.options?.model || this.defaultModel,
                summary: analysis.summary,
                keyPoints: analysis.keyPoints,
                actionItems: analysis.actionItems.map((item) => ({
                    description: item.description,
                    priority: item.priority,
                    status: 'pending' as const,
                    createdAt: new Date()
                })),
                sentiment: {
                    overall: analysis.sentiment.overall,
                    score: analysis.sentiment.score,
                    breakdown: {
                        positive: analysis.sentiment.overall === 'positive' ? 0.6 : 0.2,
                        neutral: analysis.sentiment.overall === 'neutral' ? 0.6 : 0.3,
                        negative: analysis.sentiment.overall === 'negative' ? 0.6 : 0.1
                    },
                    highlights: analysis.sentiment.highlights
                },
                topics: analysis.topics,
                nextSteps: analysis.nextSteps,
                opportunities: analysis.opportunities.map((opp) => ({
                    type: opp.type,
                    description: opp.description,
                    estimatedValue: opp.estimatedValue,
                    probability: opp.probability,
                    suggestedAction: 'Create opportunity in pipeline'
                })),
                generatedAt: new Date(),
                processingTime: Math.floor((Date.now() - startTime) / 1000)
            };

            // Update call with AI summary
            await Call.updateOne(
                { _id: data.callId },
                { aiSummary }
            );

            return aiSummary;
        } catch (error) {
            // Mark as failed
            await Call.updateOne(
                { _id: data.callId },
                {
                    'aiSummary.status': 'failed',
                    'aiSummary.error': (error as Error).message
                }
            );
            throw error;
        }
    }

    // ===========================================================================
    // OPENAI INTEGRATION
    // ===========================================================================

    private async generateAnalysis(
        transcript: string,
        contactName: string,
        accountName: string,
        options: AnalysisOptions = {}
    ): Promise<AIAnalysisResult> {
        const model = options.model || this.defaultModel;

        const systemPrompt = this.buildSystemPrompt();
        const userPrompt = this.buildUserPrompt(transcript, contactName, accountName, options);

        const completion = await this.openai.chat.completions.create({
            model,
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt }
            ],
            temperature: 0.3,
            max_tokens: 2000,
            response_format: { type: 'json_object' }
        });

        const content = completion.choices[0]?.message?.content;
        if (!content) {
            throw new Error('Empty response from OpenAI');
        }

        try {
            return JSON.parse(content) as AIAnalysisResult;
        } catch {
            throw new Error('Invalid JSON response from OpenAI');
        }
    }

    private buildSystemPrompt(): string {
        return `You are an expert sales call analyzer for a CRM system. Your task is to analyze sales call transcripts and extract actionable insights.

You must return a valid JSON object with the following structure:
{
  "summary": "A 2-3 sentence executive summary of the call",
  "keyPoints": ["Array of 3-5 key discussion points"],
  "actionItems": [
    {
      "description": "What needs to be done",
      "priority": "low|medium|high",
      "suggestedDueDate": "YYYY-MM-DD or null"
    }
  ],
  "sentiment": {
    "overall": "positive|neutral|negative",
    "score": 0.0 to 1.0,
    "highlights": {
      "positive": ["Positive statements or indicators"],
      "concerns": ["Concerns or objections raised"]
    }
  },
  "topics": ["Main topics discussed"],
  "nextSteps": "Recommended next steps as a paragraph",
  "opportunities": [
    {
      "type": "upsell|cross-sell|renewal|new",
      "description": "Description of the opportunity",
      "estimatedValue": null or number,
      "probability": 0.0 to 1.0 or null
    }
  ]
}

Be specific, actionable, and focus on business value. If certain information is not available in the transcript, use reasonable defaults or null values.`;
    }

    private buildUserPrompt(
        transcript: string,
        contactName: string,
        accountName: string,
        options: AnalysisOptions
    ): string {
        let prompt = `Analyze the following sales call transcript:

Contact: ${contactName}
Account: ${accountName}

TRANSCRIPT:
${transcript}

Please provide a comprehensive analysis in JSON format.`;

        if (options.includeActionItems === false) {
            prompt += '\n\nNote: Minimize action items.';
        }

        if (options.includeSentiment === false) {
            prompt += '\n\nNote: Use default neutral sentiment.';
        }

        if (options.includeOpportunities === false) {
            prompt += '\n\nNote: Skip opportunity detection.';
        }

        return prompt;
    }

    // ===========================================================================
    // STREAMING ANALYSIS (Real-time)
    // ===========================================================================

    public async streamAnalysis(
        transcript: string,
        contactName: string,
        accountName: string,
        onChunk: (chunk: string) => void
    ): Promise<void> {
        const stream = await this.openai.chat.completions.create({
            model: this.defaultModel,
            messages: [
                { role: 'system', content: this.buildSystemPrompt() },
                { role: 'user', content: this.buildUserPrompt(transcript, contactName, accountName, {}) }
            ],
            temperature: 0.3,
            max_tokens: 2000,
            stream: true
        });

        for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content;
            if (content) {
                onChunk(content);
            }
        }
    }

    // ===========================================================================
    // QUICK ANALYSIS (Single API call)
    // ===========================================================================

    public async getQuickSummary(transcript: string): Promise<string> {
        const completion = await this.openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
                {
                    role: 'system',
                    content: 'Summarize the following call transcript in 2-3 sentences, focusing on the main outcome and next steps.'
                },
                { role: 'user', content: transcript }
            ],
            temperature: 0.3,
            max_tokens: 200
        });

        return completion.choices[0]?.message?.content || '';
    }

    public async extractActionItems(transcript: string): Promise<string[]> {
        const completion = await this.openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
                {
                    role: 'system',
                    content: 'Extract action items from the call transcript. Return as a JSON array of strings. Only include clear, actionable tasks.'
                },
                { role: 'user', content: transcript }
            ],
            temperature: 0.2,
            max_tokens: 500,
            response_format: { type: 'json_object' }
        });

        try {
            const parsed = JSON.parse(completion.choices[0]?.message?.content || '{"items":[]}');
            return parsed.items || parsed.actionItems || [];
        } catch {
            return [];
        }
    }

    public async analyzeSentiment(transcript: string): Promise<ISentiment> {
        const completion = await this.openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
                {
                    role: 'system',
                    content: `Analyze the sentiment of this call transcript. Return JSON:
{
  "overall": "positive|neutral|negative",
  "score": 0.0 to 1.0,
  "breakdown": { "positive": 0-1, "neutral": 0-1, "negative": 0-1 },
  "highlights": { "positive": ["..."], "concerns": ["..."] }
}`
                },
                { role: 'user', content: transcript }
            ],
            temperature: 0.2,
            max_tokens: 500,
            response_format: { type: 'json_object' }
        });

        try {
            return JSON.parse(completion.choices[0]?.message?.content || '{}') as ISentiment;
        } catch {
            return {
                overall: 'neutral',
                score: 0.5,
                breakdown: { positive: 0.33, neutral: 0.34, negative: 0.33 }
            };
        }
    }

    // ===========================================================================
    // MANAGEMENT METHODS
    // ===========================================================================

    public async getAnalysisStatus(callId: string): Promise<{
        status: string;
        progress?: number;
        estimatedCompletion?: Date;
    }> {
        const call = await Call.findById(callId, 'aiSummary.status').lean();

        if (!call) {
            throw new Error('Call not found');
        }

        return {
            status: call.aiSummary?.status || 'pending'
        };
    }

    public async retryAnalysis(callId: string): Promise<void> {
        await Call.updateOne(
            { _id: callId },
            {
                'aiSummary.status': 'pending',
                'aiSummary.error': null
            }
        );

        await this.analyzeCall(callId);
    }

    public async getQueueStats(): Promise<{
        waiting: number;
        active: number;
        completed: number;
        failed: number;
    }> {
        const [waiting, active, completed, failed] = await Promise.all([
            this.analysisQueue.getWaitingCount(),
            this.analysisQueue.getActiveCount(),
            this.analysisQueue.getCompletedCount(),
            this.analysisQueue.getFailedCount()
        ]);

        return { waiting, active, completed, failed };
    }

    public async shutdown(): Promise<void> {
        await this.analysisQueue.close();
        this.logger.info('AI Call Analysis Service shut down');
    }
}

// =============================================================================
// SINGLETON EXPORT
// =============================================================================

let instance: AICallAnalysisService | null = null;

export function getAICallAnalysisService(): AICallAnalysisService {
    if (!instance) {
        instance = new AICallAnalysisService();
    }
    return instance;
}

export default AICallAnalysisService;
