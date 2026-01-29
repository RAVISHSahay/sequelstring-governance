// server/src/routes/intelligence.routes.ts
// Feature 3: Public Domain Intelligence API Routes

import { Router } from 'express';
import { IntelligenceController } from '../controllers/IntelligenceController';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';
import {
    getNewsSchema,
    alertActionSchema,
    subscriptionSchema
} from '../validators/intelligence.validator';

const router = Router();
const controller = new IntelligenceController();

// All routes require authentication
router.use(authenticate);

// News Feed
router.get(
    '/accounts/:accountId/news',
    validate(getNewsSchema),
    controller.getNewsFeed
);

router.get(
    '/feed',
    controller.getUserIntelligenceFeed
);

// Alert Actions
router.post(
    '/alerts/:alertId/action',
    validate(alertActionSchema),
    controller.takeAction
);

router.get(
    '/alerts/:alertId',
    controller.getAlertDetails
);

// Subscriptions
router.get(
    '/subscriptions',
    controller.getSubscriptions
);

router.post(
    '/subscriptions',
    validate(subscriptionSchema),
    controller.createSubscription
);

router.put(
    '/subscriptions/:id',
    validate(subscriptionSchema),
    controller.updateSubscription
);

router.delete(
    '/subscriptions/:id',
    controller.deleteSubscription
);

// Competitive Intelligence
router.get(
    '/competitors/:accountId',
    controller.getCompetitorNews
);

router.get(
    '/trends/:accountId',
    controller.getIndustryTrends
);

// Admin / Stats
router.get(
    '/stats',
    controller.getStats
);

export default router;
