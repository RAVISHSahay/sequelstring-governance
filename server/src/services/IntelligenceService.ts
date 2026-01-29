// server/src/services/IntelligenceService.ts
// Feature 3: Public Domain Intelligence Service

import Bull, { Queue, Job } from 'bull';
import cron from 'node-cron';
import { NewsAlert, INewsAlert, NewsCategory } from '../models/NewsAlert';
import { Account, IAccount } from '../models/Account';
import { NewsAPIAdapter } from '../integrations/newsapi/NewsAPIAdapter';
import { OpenAIService } from '../integrations/openai/OpenAIService';
import { ElasticsearchClient } from '../config/elasticsearch';
import { RedisClient } from '../config/redis';
import { Logger } from '../utils/logger';

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

export interface RawArticle {
    title: string;
    description: string;
    content: string;
    url: string;
    source: {
        id: string;
        name: string;
    };
    author?: string;
    urlToImage?: string;
    publishedAt: string;
}

export interface ProcessedArticle extends RawArticle {
    category: NewsCategory;
    sentiment: {
        label: 'positive' | 'neutral' | 'negative';
        score: number;
    };
    relevanceScore: number;
    entities: Array<{
        name: string;
        type: 'company' | 'person' | 'location' | 'product';
        role?: string;
    }>;
    keywords: string[];
    topics: string[];
}

export interface AggregationJobData {
    accountId: string;
    keywords: string[];
    competitors: string[];
    categories: NewsCategory[];
}

export interface SubscriptionConfig {
    accountId: string;
    enabled: boolean;
    frequency: 'realtime' | 'daily' | 'weekly';
    keywords: string[];
    competitors: string[];
    categories: NewsCategory[];
    notifyChannels: ('email' | 'push' | 'slack')[];
}

// =============================================================================
// INTELLIGENCE SERVICE
// =============================================================================

export class IntelligenceService {
    private aggregatorQueue: Queue<AggregationJobData>;
    private newsAPI: NewsAPIAdapter;
    private openai: OpenAIService;
    private elasticsearch: ElasticsearchClient;
    private logger: Logger;
    private cronJob?: cron.ScheduledTask;

    constructor() {
        this.logger = new Logger('IntelligenceService');
        this.newsAPI = new NewsAPIAdapter();
        this.openai = new OpenAIService();
        this.elasticsearch = new ElasticsearchClient();

        // Initialize Bull queue
        this.aggregatorQueue = new Bull('news-aggregator-queue', {
            redis: RedisClient.getConfig(),
            defaultJobOptions: {
                attempts: 3,
                backoff: {
                    type: 'exponential',
                    delay: 60000 // 1 minute
                },
                removeOnComplete: 100,
                removeOnFail: 200
            }
        });

        this.setupQueueHandlers();
    }

    // ===========================================================================
    // QUEUE HANDLERS
    // ===========================================================================

    private setupQueueHandlers(): void {
        this.aggregatorQueue.process('aggregate-news', 5, async (job: Job<AggregationJobData>) => {
            return this.processAggregationJob(job);
        });

        this.aggregatorQueue.on('completed', (job: Job<AggregationJobData>, result: number) => {
            this.logger.info('News aggregation completed', {
                jobId: job.id,
                accountId: job.data.accountId,
                articlesProcessed: result
            });
        });

        this.aggregatorQueue.on('failed', (job: Job<AggregationJobData>, error: Error) => {
            this.logger.error('News aggregation failed', {
                jobId: job.id,
                accountId: job.data.accountId,
                error: error.message
            });
        });
    }

    // ===========================================================================
    // SCHEDULED AGGREGATION
    // ===========================================================================

    public startScheduler(cronExpression: string = '*/15 * * * *'): void {
        this.logger.info('Starting intelligence aggregator', { cronExpression });

        this.cronJob = cron.schedule(cronExpression, async () => {
            try {
                await this.runAggregationForAllAccounts();
            } catch (error) {
                this.logger.error('Scheduled aggregation failed', { error });
            }
        });
    }

    public stopScheduler(): void {
        if (this.cronJob) {
            this.cronJob.stop();
            this.logger.info('Intelligence aggregator stopped');
        }
    }

    public async runAggregationForAllAccounts(): Promise<number> {
        const accounts = await Account.find({
            'intelligenceConfig.newsSubscription': true
        }).lean<IAccount[]>();

        let queuedCount = 0;

        for (const account of accounts) {
            const config = account.intelligenceConfig;
            if (!config) continue;

            await this.aggregatorQueue.add('aggregate-news', {
                accountId: account._id.toString(),
                keywords: config.keywords || [],
                competitors: config.competitors || [],
                categories: config.categories || ['earnings', 'product_launch', 'leadership', 'ma']
            });

            queuedCount++;
        }

        this.logger.info('Aggregation jobs queued', { queuedCount });
        return queuedCount;
    }

    // ===========================================================================
    // NEWS AGGREGATION PIPELINE
    // ===========================================================================

    private async processAggregationJob(job: Job<AggregationJobData>): Promise<number> {
        const { accountId, keywords, competitors, categories } = job.data;
        let processedCount = 0;

        try {
            // Build search queries
            const searchQueries = this.buildSearchQueries(keywords, competitors);

            for (const query of searchQueries) {
                // Fetch articles from NewsAPI
                const articles = await this.newsAPI.searchNews({
                    q: query,
                    language: 'en',
                    sortBy: 'publishedAt',
                    pageSize: 20
                });

                for (const article of articles) {
                    try {
                        // Process and analyze article
                        const processed = await this.processArticle(article, accountId);

                        // Check relevance threshold
                        if (processed.relevanceScore < 30) continue;

                        // Check for duplicates
                        const exists = await NewsAlert.findDuplicates(article.title, article.url);
                        if (exists) continue;

                        // Store in MongoDB
                        await this.storeNewsAlert(accountId, processed);

                        // Index in Elasticsearch
                        await this.indexArticle(accountId, processed);

                        processedCount++;
                    } catch (error) {
                        this.logger.warn('Failed to process article', {
                            url: article.url,
                            error: (error as Error).message
                        });
                    }
                }
            }

            // Update last alert timestamp
            await Account.updateOne(
                { _id: accountId },
                { 'intelligenceConfig.lastAlertAt': new Date() }
            );

            return processedCount;

        } catch (error) {
            this.logger.error('Aggregation job failed', {
                accountId,
                error: (error as Error).message
            });
            throw error;
        }
    }

    private buildSearchQueries(keywords: string[], competitors: string[]): string[] {
        const queries: string[] = [];

        // Main keywords query
        if (keywords.length > 0) {
            queries.push(keywords.join(' OR '));
        }

        // Individual competitor queries
        for (const competitor of competitors) {
            queries.push(competitor);
        }

        return queries;
    }

    // ===========================================================================
    // ARTICLE PROCESSING (AI)
    // ===========================================================================

    private async processArticle(article: RawArticle, accountId: string): Promise<ProcessedArticle> {
        // Get account details for context
        const account = await Account.findById(accountId, 'name industry').lean();

        // Analyze with OpenAI
        const analysis = await this.openai.analyzeArticle({
            title: article.title,
            content: article.content || article.description,
            accountName: account?.name || '',
            industry: account?.industry || ''
        });

        return {
            ...article,
            category: analysis.category,
            sentiment: analysis.sentiment,
            relevanceScore: analysis.relevanceScore,
            entities: analysis.entities,
            keywords: analysis.keywords,
            topics: analysis.topics
        };
    }

    private async storeNewsAlert(accountId: string, article: ProcessedArticle): Promise<INewsAlert> {
        const newsAlert = new NewsAlert({
            accountId,
            title: article.title,
            summary: article.description,
            content: article.content,
            sourceUrl: article.url,
            sourceName: article.source.name,
            sourceType: 'news',
            publishedAt: new Date(article.publishedAt),
            imageUrl: article.urlToImage,
            category: article.category,
            tags: article.keywords.slice(0, 10),
            analysis: {
                sentiment: article.sentiment,
                relevanceScore: article.relevanceScore,
                entities: article.entities,
                keywords: article.keywords,
                topics: article.topics
            },
            isActive: true,
            fetchedAt: new Date()
        });

        await newsAlert.save();
        return newsAlert;
    }

    private async indexArticle(accountId: string, article: ProcessedArticle): Promise<void> {
        await this.elasticsearch.index({
            index: 'news_alerts',
            document: {
                accountId,
                title: article.title,
                summary: article.description,
                content: article.content,
                category: article.category,
                sentiment: article.sentiment.label,
                relevanceScore: article.relevanceScore,
                keywords: article.keywords,
                topics: article.topics,
                publishedAt: article.publishedAt,
                sourceName: article.source.name,
                indexedAt: new Date()
            }
        });
    }

    // ===========================================================================
    // NEWS FEED QUERIES
    // ===========================================================================

    public async getNewsFeed(
        accountId: string,
        options: {
            category?: NewsCategory;
            sentiment?: 'positive' | 'neutral' | 'negative';
            search?: string;
            limit?: number;
            offset?: number;
        } = {}
    ): Promise<INewsAlert[]> {
        // Try Elasticsearch first for search queries
        if (options.search) {
            return this.searchNews(accountId, options.search, options);
        }

        // Fallback to MongoDB
        return NewsAlert.findByAccount(accountId, {
            category: options.category,
            sentiment: options.sentiment,
            limit: options.limit || 20,
            skip: options.offset || 0
        });
    }

    private async searchNews(
        accountId: string,
        query: string,
        options: { limit?: number; offset?: number }
    ): Promise<INewsAlert[]> {
        const results = await this.elasticsearch.search({
            index: 'news_alerts',
            query: {
                bool: {
                    must: [
                        { term: { accountId } },
                        {
                            multi_match: {
                                query,
                                fields: ['title^3', 'summary^2', 'content', 'keywords'],
                                type: 'best_fields',
                                fuzziness: 'AUTO'
                            }
                        }
                    ]
                }
            },
            size: options.limit || 20,
            from: options.offset || 0,
            sort: [
                { relevanceScore: 'desc' },
                { publishedAt: 'desc' }
            ]
        });

        // Fetch full documents from MongoDB
        const ids = results.hits.hits.map((hit: { _id: string }) => hit._id);
        return NewsAlert.find({ _id: { $in: ids } }).lean();
    }

    public async getTopAlerts(accountId: string, limit: number = 5): Promise<INewsAlert[]> {
        return NewsAlert.findTopAlerts(accountId, limit);
    }

    public async getUnreadCount(accountId: string): Promise<number> {
        return NewsAlert.getUnreadCount(accountId);
    }

    // ===========================================================================
    // USER ACTIONS
    // ===========================================================================

    public async markAsRead(alertId: string, userId: string): Promise<void> {
        const alert = await NewsAlert.findById(alertId);
        if (alert) {
            await alert.markAsRead(userId);
        }
    }

    public async dismissAlert(alertId: string, userId: string): Promise<void> {
        const alert = await NewsAlert.findById(alertId);
        if (alert) {
            await alert.dismiss(userId);
        }
    }

    public async shareAlert(alertId: string, userId: string): Promise<{ shareUrl: string }> {
        const alert = await NewsAlert.findById(alertId);
        if (alert) {
            await alert.share(userId);
        }
        return { shareUrl: `${process.env.APP_URL}/intel/shared/${alertId}` };
    }

    public async createOpportunityFromAlert(
        alertId: string,
        userId: string,
        opportunityData: {
            name: string;
            value: number;
            stage: string;
        }
    ): Promise<{ opportunityId: string }> {
        // Create opportunity (would call Opportunity service)
        const opportunityId = `opp_${Date.now()}`;

        // Record interaction
        const alert = await NewsAlert.findById(alertId);
        if (alert) {
            await alert.createOpportunity(userId, opportunityId);
        }

        return { opportunityId };
    }

    // ===========================================================================
    // SUBSCRIPTION MANAGEMENT
    // ===========================================================================

    public async getSubscription(accountId: string): Promise<SubscriptionConfig | null> {
        const account = await Account.findById(accountId, 'intelligenceConfig').lean();

        if (!account?.intelligenceConfig) {
            return null;
        }

        return {
            accountId,
            enabled: account.intelligenceConfig.newsSubscription,
            frequency: account.intelligenceConfig.alertFrequency,
            keywords: account.intelligenceConfig.keywords,
            competitors: account.intelligenceConfig.competitors,
            categories: account.intelligenceConfig.categories,
            notifyChannels: account.intelligenceConfig.notifyChannels || ['push']
        };
    }

    public async updateSubscription(
        accountId: string,
        config: Partial<SubscriptionConfig>
    ): Promise<SubscriptionConfig> {
        const updateFields: Record<string, unknown> = {};

        if (config.enabled !== undefined) {
            updateFields['intelligenceConfig.newsSubscription'] = config.enabled;
        }
        if (config.frequency) {
            updateFields['intelligenceConfig.alertFrequency'] = config.frequency;
        }
        if (config.keywords) {
            updateFields['intelligenceConfig.keywords'] = config.keywords;
        }
        if (config.competitors) {
            updateFields['intelligenceConfig.competitors'] = config.competitors;
        }
        if (config.categories) {
            updateFields['intelligenceConfig.categories'] = config.categories;
        }
        if (config.notifyChannels) {
            updateFields['intelligenceConfig.notifyChannels'] = config.notifyChannels;
        }

        await Account.updateOne(
            { _id: accountId },
            { $set: updateFields }
        );

        return this.getSubscription(accountId) as Promise<SubscriptionConfig>;
    }

    // ===========================================================================
    // COMPETITIVE INTELLIGENCE
    // ===========================================================================

    public async getCompetitorNews(
        accountId: string,
        competitorName: string,
        limit: number = 10
    ): Promise<INewsAlert[]> {
        return NewsAlert.find({
            accountId,
            isActive: true,
            'analysis.entities': {
                $elemMatch: {
                    name: { $regex: new RegExp(competitorName, 'i') },
                    type: 'company'
                }
            }
        })
            .sort({ publishedAt: -1 })
            .limit(limit)
            .lean();
    }

    public async getIndustryTrends(accountId: string): Promise<{
        topTopics: string[];
        sentimentBreakdown: { positive: number; neutral: number; negative: number };
        categoryBreakdown: Record<string, number>;
    }> {
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

        const alerts = await NewsAlert.find({
            accountId,
            isActive: true,
            publishedAt: { $gte: thirtyDaysAgo }
        }).lean();

        // Calculate topic frequency
        const topicCount: Record<string, number> = {};
        const categoryCount: Record<string, number> = {};
        const sentimentCount = { positive: 0, neutral: 0, negative: 0 };

        for (const alert of alerts) {
            // Topics
            for (const topic of alert.analysis?.topics || []) {
                topicCount[topic] = (topicCount[topic] || 0) + 1;
            }

            // Categories
            categoryCount[alert.category] = (categoryCount[alert.category] || 0) + 1;

            // Sentiment
            const sentiment = alert.analysis?.sentiment?.label || 'neutral';
            sentimentCount[sentiment]++;
        }

        // Sort topics by frequency
        const topTopics = Object.entries(topicCount)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10)
            .map(([topic]) => topic);

        return {
            topTopics,
            sentimentBreakdown: sentimentCount,
            categoryBreakdown: categoryCount
        };
    }

    // ===========================================================================
    // MANAGEMENT
    // ===========================================================================

    public async getQueueStats(): Promise<{
        waiting: number;
        active: number;
        completed: number;
        failed: number;
    }> {
        const [waiting, active, completed, failed] = await Promise.all([
            this.aggregatorQueue.getWaitingCount(),
            this.aggregatorQueue.getActiveCount(),
            this.aggregatorQueue.getCompletedCount(),
            this.aggregatorQueue.getFailedCount()
        ]);

        return { waiting, active, completed, failed };
    }

    public async cleanupOldAlerts(olderThanDays: number = 30): Promise<number> {
        const cutoffDate = new Date(Date.now() - olderThanDays * 24 * 60 * 60 * 1000);

        const result = await NewsAlert.deleteMany({
            publishedAt: { $lt: cutoffDate }
        });

        this.logger.info('Cleaned up old alerts', { deleted: result.deletedCount });
        return result.deletedCount || 0;
    }

    public async shutdown(): Promise<void> {
        this.stopScheduler();
        await this.aggregatorQueue.close();
        this.logger.info('Intelligence Service shut down');
    }
}

// =============================================================================
// SINGLETON EXPORT
// =============================================================================

let instance: IntelligenceService | null = null;

export function getIntelligenceService(): IntelligenceService {
    if (!instance) {
        instance = new IntelligenceService();
    }
    return instance;
}

export default IntelligenceService;
