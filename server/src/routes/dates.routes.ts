// server/src/routes/dates.routes.ts
// Feature 1: Important Dates API Routes

import { Router } from 'express';
import { DatesController } from '../controllers/DatesController';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';
import {
    createDateSchema,
    updateDateSchema,
    sendEmailSchema
} from '../validators/dates.validator';

const router = Router();
const controller = new DatesController();

// All routes require authentication
router.use(authenticate);

// GET /contacts/:contactId/dates - List all important dates
router.get(
    '/:contactId/dates',
    controller.listDates
);

// POST /contacts/:contactId/dates - Create new important date
router.post(
    '/:contactId/dates',
    validate(createDateSchema),
    controller.createDate
);

// GET /contacts/:contactId/dates/:dateId - Get date details
router.get(
    '/:contactId/dates/:dateId',
    controller.getDate
);

// PUT /contacts/:contactId/dates/:dateId - Update date
router.put(
    '/:contactId/dates/:dateId',
    validate(updateDateSchema),
    controller.updateDate
);

// DELETE /contacts/:contactId/dates/:dateId - Delete date
router.delete(
    '/:contactId/dates/:dateId',
    controller.deleteDate
);

// POST /contacts/:contactId/dates/:dateId/send - Send email now
router.post(
    '/:contactId/dates/:dateId/send',
    validate(sendEmailSchema),
    controller.sendEmailNow
);

// GET /email-templates - List email templates
router.get(
    '/email-templates',
    controller.listTemplates
);

export default router;
