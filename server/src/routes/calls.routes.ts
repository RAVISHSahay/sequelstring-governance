// server/src/routes/calls.routes.ts
// Feature 4: Calls API Routes with AI Analysis

import { Router } from 'express';
import { CallsController } from '../controllers/CallsController';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';
import {
    listCallsSchema,
    scheduleCallSchema,
    updateCallSchema,
    generateTranscriptSchema,
    generateAISummarySchema,
    updateActionItemSchema
} from '../validators/calls.validator';

const router = Router();
const controller = new CallsController();

// All routes require authentication
router.use(authenticate);

// ============================================================================
// CALL MANAGEMENT
// ============================================================================

// GET /calls - List all calls
router.get(
    '/',
    validate(listCallsSchema),
    controller.listCalls
);

// POST /calls - Schedule new call
router.post(
    '/',
    validate(scheduleCallSchema),
    controller.scheduleCall
);

// GET /calls/:callId - Get call details
router.get(
    '/:callId',
    controller.getCallDetails
);

// PUT /calls/:callId - Update call
router.put(
    '/:callId',
    validate(updateCallSchema),
    controller.updateCall
);

// DELETE /calls/:callId - Cancel call
router.delete(
    '/:callId',
    controller.cancelCall
);

// ============================================================================
// RECORDINGS
// ============================================================================

// GET /calls/:callId/recording - Get signed recording URL
router.get(
    '/:callId/recording',
    controller.getRecordingUrl
);

// ============================================================================
// TRANSCRIPTS
// ============================================================================

// GET /calls/:callId/transcript - Get transcript
router.get(
    '/:callId/transcript',
    controller.getTranscript
);

// POST /calls/:callId/transcript/generate - Generate transcript
router.post(
    '/:callId/transcript/generate',
    validate(generateTranscriptSchema),
    controller.generateTranscript
);

// ============================================================================
// AI SUMMARY
// ============================================================================

// GET /calls/:callId/ai-summary - Get AI summary
router.get(
    '/:callId/ai-summary',
    controller.getAISummary
);

// POST /calls/:callId/ai-summary/generate - Generate AI summary
router.post(
    '/:callId/ai-summary/generate',
    validate(generateAISummarySchema),
    controller.generateAISummary
);

// GET /calls/:callId/ai-summary/action-items - Get action items
router.get(
    '/:callId/ai-summary/action-items',
    controller.getActionItems
);

// PATCH /calls/:callId/ai-summary/action-items/:itemId - Update action item
router.patch(
    '/:callId/ai-summary/action-items/:itemId',
    validate(updateActionItemSchema),
    controller.updateActionItem
);

// ============================================================================
// CALL EVENTS (Webhooks from CTI)
// ============================================================================

// POST /calls/webhooks/twilio - Twilio webhook
router.post(
    '/webhooks/twilio',
    controller.twilioWebhook
);

// POST /calls/webhooks/recording-complete - Recording ready webhook
router.post(
    '/webhooks/recording-complete',
    controller.recordingCompleteWebhook
);

export default router;
