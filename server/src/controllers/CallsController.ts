// server/src/controllers/CallsController.ts
// Feature 4: Calls Controller with AI Analysis

import { Request, Response, NextFunction } from 'express';
import { Call, ICall } from '../models/Call';
import { getAICallAnalysisService } from '../services/AICallAnalysisService';
import { TranscriptionService } from '../services/TranscriptionService';
import { S3Service } from '../integrations/aws/S3Service';
import { Types } from 'mongoose';

export class CallsController {

    // GET /calls - List all calls
    async listCalls(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.user!.id;
            const { contactId, accountId, status, type, from, to, page = 1, limit = 20 } = req.query;

            const query: Record<string, unknown> = { userId };

            if (contactId) query.contactId = contactId;
            if (accountId) query.accountId = accountId;
            if (status) query.status = status;
            if (type) query.type = type;
            if (from || to) {
                query.startedAt = {};
                if (from) (query.startedAt as Record<string, Date>).$gte = new Date(from as string);
                if (to) (query.startedAt as Record<string, Date>).$lte = new Date(to as string);
            }

            const skip = (Number(page) - 1) * Number(limit);

            const [calls, total] = await Promise.all([
                Call.find(query)
                    .populate('contactId', 'firstName lastName email')
                    .populate('accountId', 'name')
                    .sort({ startedAt: -1 })
                    .skip(skip)
                    .limit(Number(limit))
                    .lean(),
                Call.countDocuments(query)
            ]);

            // Transform response
            const data = calls.map(call => ({
                id: call._id,
                contact: call.contactId,
                account: call.accountId,
                type: call.type,
                status: call.status,
                scheduledAt: call.scheduledAt,
                duration: call.duration,
                hasRecording: call.recording?.status === 'available',
                hasTranscript: call.transcript?.status === 'completed',
                hasAISummary: call.aiSummary?.status === 'completed',
                sentiment: call.aiSummary?.sentiment?.overall
            }));

            res.json({
                success: true,
                data,
                meta: {
                    page: Number(page),
                    limit: Number(limit),
                    total,
                    totalPages: Math.ceil(total / Number(limit))
                }
            });
        } catch (error) {
            next(error);
        }
    }

    // POST /calls - Schedule new call
    async scheduleCall(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.user!.id;
            const { contactId, accountId, scheduledAt, duration, type, notes, ctiProvider, dialNumber } = req.body;

            const call = new Call({
                contactId,
                accountId,
                userId,
                type: type || 'scheduled',
                status: 'scheduled',
                scheduledAt: new Date(scheduledAt),
                ctiProvider,
                dialedNumber: dialNumber,
                notes,
                createdBy: userId
            });

            await call.save();

            res.status(201).json({
                success: true,
                data: {
                    id: call._id,
                    status: call.status,
                    scheduledAt: call.scheduledAt,
                    message: 'Call scheduled successfully'
                }
            });
        } catch (error) {
            next(error);
        }
    }

    // GET /calls/:callId - Get call details
    async getCallDetails(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { callId } = req.params;

            const call = await Call.findById(callId)
                .populate('contactId', 'firstName lastName email phone')
                .populate('accountId', 'name website')
                .populate('userId', 'firstName lastName email')
                .lean();

            if (!call) {
                res.status(404).json({
                    success: false,
                    error: { code: 'NOT_FOUND', message: 'Call not found' }
                });
                return;
            }

            res.json({
                success: true,
                data: {
                    id: call._id,
                    contact: call.contactId,
                    account: call.accountId,
                    user: call.userId,
                    type: call.type,
                    status: call.status,
                    scheduledAt: call.scheduledAt,
                    startedAt: call.startedAt,
                    endedAt: call.endedAt,
                    duration: call.duration,
                    recording: call.recording ? {
                        status: call.recording.status,
                        duration: call.recording.duration
                    } : null,
                    transcriptAvailable: call.transcript?.status === 'completed',
                    aiSummaryAvailable: call.aiSummary?.status === 'completed',
                    notes: call.notes,
                    tags: call.tags
                }
            });
        } catch (error) {
            next(error);
        }
    }

    // PUT /calls/:callId - Update call
    async updateCall(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { callId } = req.params;
            const updates = req.body;

            const allowedUpdates = ['scheduledAt', 'notes', 'tags', 'status'];
            const updateFields: Record<string, unknown> = {};

            for (const field of allowedUpdates) {
                if (updates[field] !== undefined) {
                    updateFields[field] = updates[field];
                }
            }

            const call = await Call.findByIdAndUpdate(
                callId,
                { $set: updateFields },
                { new: true }
            );

            if (!call) {
                res.status(404).json({
                    success: false,
                    error: { code: 'NOT_FOUND', message: 'Call not found' }
                });
                return;
            }

            res.json({
                success: true,
                data: { message: 'Call updated successfully' }
            });
        } catch (error) {
            next(error);
        }
    }

    // DELETE /calls/:callId - Cancel call
    async cancelCall(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { callId } = req.params;

            const call = await Call.findByIdAndUpdate(
                callId,
                { status: 'cancelled' },
                { new: true }
            );

            if (!call) {
                res.status(404).json({
                    success: false,
                    error: { code: 'NOT_FOUND', message: 'Call not found' }
                });
                return;
            }

            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }

    // GET /calls/:callId/recording - Get signed recording URL
    async getRecordingUrl(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { callId } = req.params;

            const call = await Call.findById(callId, 'recording').lean();

            if (!call || !call.recording) {
                res.status(404).json({
                    success: false,
                    error: { code: 'NOT_FOUND', message: 'Recording not found' }
                });
                return;
            }

            if (call.recording.status !== 'available') {
                res.status(400).json({
                    success: false,
                    error: { code: 'NOT_READY', message: 'Recording is still processing' }
                });
                return;
            }

            // Generate signed URL (expires in 1 hour)
            const s3 = new S3Service();
            const signedUrl = await s3.getSignedUrl(call.recording.url, 3600);

            res.json({
                success: true,
                data: {
                    url: signedUrl,
                    expiresAt: new Date(Date.now() + 3600 * 1000),
                    duration: call.recording.duration,
                    format: call.recording.format,
                    size: call.recording.size
                }
            });
        } catch (error) {
            next(error);
        }
    }

    // GET /calls/:callId/transcript - Get transcript
    async getTranscript(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { callId } = req.params;
            const { format = 'full' } = req.query;

            const call = await Call.findById(callId, 'transcript').lean();

            if (!call || !call.transcript) {
                res.status(404).json({
                    success: false,
                    error: { code: 'NOT_FOUND', message: 'Transcript not found' }
                });
                return;
            }

            if (call.transcript.status !== 'completed') {
                res.json({
                    success: true,
                    data: {
                        status: call.transcript.status,
                        message: call.transcript.status === 'processing'
                            ? 'Transcript is being generated'
                            : 'Transcript generation pending'
                    }
                });
                return;
            }

            const response: Record<string, unknown> = {
                status: 'completed',
                language: call.transcript.language,
                confidence: call.transcript.confidence,
                wordCount: call.transcript.wordCount,
                processedAt: call.transcript.processedAt
            };

            if (format === 'full' || format === 'segments') {
                response.segments = call.transcript.segments;
            }

            if (format === 'full' || format === 'text') {
                response.text = call.transcript.text;
            }

            res.json({
                success: true,
                data: response
            });
        } catch (error) {
            next(error);
        }
    }

    // POST /calls/:callId/transcript/generate - Generate transcript
    async generateTranscript(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { callId } = req.params;
            const { language = 'en-US', speakerDiarization = true } = req.body;

            const call = await Call.findById(callId, 'recording transcript');

            if (!call) {
                res.status(404).json({
                    success: false,
                    error: { code: 'NOT_FOUND', message: 'Call not found' }
                });
                return;
            }

            if (!call.recording || call.recording.status !== 'available') {
                res.status(400).json({
                    success: false,
                    error: { code: 'NO_RECORDING', message: 'Recording not available' }
                });
                return;
            }

            // Queue transcription job
            const transcriptionService = new TranscriptionService();
            const jobId = await transcriptionService.queueTranscription(callId, {
                language,
                speakerDiarization
            });

            // Update status
            await Call.updateOne(
                { _id: callId },
                { 'transcript.status': 'processing' }
            );

            res.status(202).json({
                success: true,
                data: {
                    jobId,
                    status: 'queued',
                    estimatedCompletion: new Date(Date.now() + 60000) // ~1 minute
                }
            });
        } catch (error) {
            next(error);
        }
    }

    // GET /calls/:callId/ai-summary - Get AI summary
    async getAISummary(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { callId } = req.params;

            const call = await Call.findById(callId, 'aiSummary')
                .populate('aiSummary.actionItems.assigneeId', 'firstName lastName')
                .lean();

            if (!call || !call.aiSummary) {
                res.status(404).json({
                    success: false,
                    error: { code: 'NOT_FOUND', message: 'AI summary not found' }
                });
                return;
            }

            if (call.aiSummary.status !== 'completed') {
                res.json({
                    success: true,
                    data: {
                        status: call.aiSummary.status,
                        message: call.aiSummary.status === 'processing'
                            ? 'AI summary is being generated'
                            : 'AI summary generation pending'
                    }
                });
                return;
            }

            res.json({
                success: true,
                data: call.aiSummary
            });
        } catch (error) {
            next(error);
        }
    }

    // POST /calls/:callId/ai-summary/generate - Generate AI summary
    async generateAISummary(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { callId } = req.params;
            const options = req.body;

            const aiService = getAICallAnalysisService();
            const { jobId, status } = await aiService.analyzeCall(callId, options);

            res.status(202).json({
                success: true,
                data: {
                    jobId,
                    status,
                    estimatedCompletion: new Date(Date.now() + 15000) // ~15 seconds
                }
            });
        } catch (error) {
            next(error);
        }
    }

    // GET /calls/:callId/ai-summary/action-items - Get action items
    async getActionItems(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { callId } = req.params;

            const call = await Call.findById(callId, 'aiSummary.actionItems')
                .populate('aiSummary.actionItems.assigneeId', 'firstName lastName email')
                .lean();

            if (!call || !call.aiSummary?.actionItems) {
                res.status(404).json({
                    success: false,
                    error: { code: 'NOT_FOUND', message: 'Action items not found' }
                });
                return;
            }

            res.json({
                success: true,
                data: call.aiSummary.actionItems
            });
        } catch (error) {
            next(error);
        }
    }

    // PATCH /calls/:callId/ai-summary/action-items/:itemId - Update action item
    async updateActionItem(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { callId, itemId } = req.params;
            const { status, completedAt } = req.body;

            const updateFields: Record<string, unknown> = {};

            if (status) {
                updateFields['aiSummary.actionItems.$.status'] = status;
            }

            if (status === 'completed') {
                updateFields['aiSummary.actionItems.$.completedAt'] = completedAt || new Date();
            }

            const result = await Call.updateOne(
                { _id: callId, 'aiSummary.actionItems._id': itemId },
                { $set: updateFields }
            );

            if (result.matchedCount === 0) {
                res.status(404).json({
                    success: false,
                    error: { code: 'NOT_FOUND', message: 'Action item not found' }
                });
                return;
            }

            res.json({
                success: true,
                data: { message: 'Action item updated' }
            });
        } catch (error) {
            next(error);
        }
    }

    // POST /calls/webhooks/twilio - Twilio status webhook
    async twilioWebhook(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { CallSid, CallStatus, Duration } = req.body;

            // Find call by external ID
            const call = await Call.findOne({ externalCallId: CallSid });

            if (!call) {
                res.status(200).send('OK'); // Still acknowledge
                return;
            }

            // Update call status
            switch (CallStatus) {
                case 'in-progress':
                    call.status = 'in-progress';
                    call.startedAt = new Date();
                    break;
                case 'completed':
                    call.status = 'completed';
                    call.endedAt = new Date();
                    call.duration = parseInt(Duration, 10);
                    break;
                case 'no-answer':
                case 'busy':
                case 'failed':
                    call.status = 'missed';
                    break;
            }

            await call.save();

            res.status(200).send('OK');
        } catch (error) {
            next(error);
        }
    }

    // POST /calls/webhooks/recording-complete - Recording ready webhook
    async recordingCompleteWebhook(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { CallSid, RecordingUrl, RecordingDuration } = req.body;

            // Update call with recording info
            await Call.updateOne(
                { externalCallId: CallSid },
                {
                    'recording.url': RecordingUrl,
                    'recording.duration': parseInt(RecordingDuration, 10),
                    'recording.status': 'available',
                    'recording.uploadedAt': new Date()
                }
            );

            // Auto-queue transcription
            const call = await Call.findOne({ externalCallId: CallSid });
            if (call) {
                const transcriptionService = new TranscriptionService();
                await transcriptionService.queueTranscription(call._id.toString());
            }

            res.status(200).send('OK');
        } catch (error) {
            next(error);
        }
    }
}

export default CallsController;
