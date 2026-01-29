// server/src/routes/social.routes.ts
// Feature 2: Social Profile API Routes

import { Router } from 'express';
import { SocialController } from '../controllers/SocialController';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';
import {
    connectProfileSchema,
    syncProfileSchema
} from '../validators/social.validator';

const router = Router();
const controller = new SocialController();

// All routes require authentication
router.use(authenticate);

// GET /contacts/:contactId/social - List social profiles
router.get(
    '/:contactId/social',
    controller.listProfiles
);

// POST /contacts/:contactId/social - Connect new profile
router.post(
    '/:contactId/social',
    validate(connectProfileSchema),
    controller.connectProfile
);

// DELETE /contacts/:contactId/social/:profileId - Disconnect profile
router.delete(
    '/:contactId/social/:profileId',
    controller.disconnectProfile
);

// POST /contacts/:contactId/social/:profileId/sync - Force sync
router.post(
    '/:contactId/social/:profileId/sync',
    validate(syncProfileSchema),
    controller.forceSync
);

// GET /contacts/:contactId/social/activity - Get activity feed
router.get(
    '/:contactId/social/activity',
    controller.getActivityFeed
);

// OAuth callbacks
router.get('/oauth/linkedin/callback', controller.linkedInCallback);
router.get('/oauth/twitter/callback', controller.twitterCallback);

export default router;
