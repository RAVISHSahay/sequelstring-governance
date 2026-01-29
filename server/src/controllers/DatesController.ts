// server/src/controllers/DatesController.ts
// Feature 1: Important Dates Controller

import { Request, Response, NextFunction } from 'express';
import { Contact, IImportantDate } from '../models/Contact';
import { EmailTemplate } from '../models/EmailTemplate';
import { getEmailSchedulerService } from '../services/EmailSchedulerService';
import { Types } from 'mongoose';

export class DatesController {

    // GET /contacts/:contactId/dates
    async listDates(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { contactId } = req.params;
            const { type, isActive, upcoming } = req.query;

            const contact = await Contact.findById(contactId, 'importantDates').lean();

            if (!contact) {
                res.status(404).json({
                    success: false,
                    error: { code: 'NOT_FOUND', message: 'Contact not found' }
                });
                return;
            }

            let dates = contact.importantDates || [];

            // Filter by type
            if (type) {
                dates = dates.filter(d => d.type === type);
            }

            // Filter by active status
            if (isActive !== undefined) {
                const active = isActive === 'true';
                dates = dates.filter(d => d.isActive === active);
            }

            // Filter upcoming within N days
            if (upcoming) {
                const days = parseInt(upcoming as string, 10);
                const now = new Date();
                const futureDate = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
                dates = dates.filter(d => {
                    if (!d.nextSendAt) return false;
                    const sendAt = new Date(d.nextSendAt);
                    return sendAt >= now && sendAt <= futureDate;
                });
            }

            res.json({
                success: true,
                data: dates,
                meta: { total: dates.length }
            });
        } catch (error) {
            next(error);
        }
    }

    // POST /contacts/:contactId/dates
    async createDate(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { contactId } = req.params;
            const { type, date, year, sendTime, timezone, emailTemplateId, repeatAnnually } = req.body;

            // Verify contact exists
            const contact = await Contact.findById(contactId);
            if (!contact) {
                res.status(404).json({
                    success: false,
                    error: { code: 'NOT_FOUND', message: 'Contact not found' }
                });
                return;
            }

            // Verify template exists
            const template = await EmailTemplate.findById(emailTemplateId);
            if (!template) {
                res.status(400).json({
                    success: false,
                    error: { code: 'VALIDATION_ERROR', message: 'Email template not found' }
                });
                return;
            }

            // Create new important date
            const newDate: Partial<IImportantDate> = {
                _id: new Types.ObjectId(),
                type,
                date,
                year,
                sendTime: sendTime || '09:00',
                timezone: timezone || 'UTC',
                emailTemplateId: new Types.ObjectId(emailTemplateId),
                repeatAnnually: repeatAnnually !== false,
                optOut: false,
                isActive: true,
                createdAt: new Date()
            };

            // Calculate next send date
            newDate.nextSendAt = this.calculateNextSendDate(date, sendTime || '09:00');

            // Add to contact
            contact.importantDates.push(newDate as IImportantDate);
            await contact.save();

            res.status(201).json({
                success: true,
                data: {
                    id: newDate._id,
                    type: newDate.type,
                    date: newDate.date,
                    nextSendAt: newDate.nextSendAt,
                    message: 'Important date created. Email scheduled.'
                }
            });
        } catch (error) {
            next(error);
        }
    }

    // GET /contacts/:contactId/dates/:dateId
    async getDate(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { contactId, dateId } = req.params;

            const contact = await Contact.findOne(
                { _id: contactId, 'importantDates._id': dateId },
                { 'importantDates.$': 1 }
            ).populate('importantDates.emailTemplateId', 'name description');

            if (!contact || !contact.importantDates?.length) {
                res.status(404).json({
                    success: false,
                    error: { code: 'NOT_FOUND', message: 'Important date not found' }
                });
                return;
            }

            res.json({
                success: true,
                data: contact.importantDates[0]
            });
        } catch (error) {
            next(error);
        }
    }

    // PUT /contacts/:contactId/dates/:dateId
    async updateDate(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { contactId, dateId } = req.params;
            const updates = req.body;

            // Build update object
            const setFields: Record<string, unknown> = {};
            const allowedFields = ['type', 'date', 'year', 'sendTime', 'timezone', 'emailTemplateId', 'repeatAnnually', 'isActive', 'optOut'];

            for (const field of allowedFields) {
                if (updates[field] !== undefined) {
                    setFields[`importantDates.$.${field}`] = updates[field];
                }
            }

            // Recalculate next send date if date or time changed
            if (updates.date || updates.sendTime) {
                const contact = await Contact.findOne(
                    { _id: contactId, 'importantDates._id': dateId },
                    { 'importantDates.$': 1 }
                );
                const currentDate = contact?.importantDates?.[0];
                const newDate = updates.date || currentDate?.date || '';
                const newTime = updates.sendTime || currentDate?.sendTime || '09:00';
                setFields['importantDates.$.nextSendAt'] = this.calculateNextSendDate(newDate, newTime);
            }

            setFields['importantDates.$.updatedAt'] = new Date();

            const result = await Contact.updateOne(
                { _id: contactId, 'importantDates._id': dateId },
                { $set: setFields }
            );

            if (result.matchedCount === 0) {
                res.status(404).json({
                    success: false,
                    error: { code: 'NOT_FOUND', message: 'Important date not found' }
                });
                return;
            }

            res.json({
                success: true,
                data: { message: 'Important date updated successfully' }
            });
        } catch (error) {
            next(error);
        }
    }

    // DELETE /contacts/:contactId/dates/:dateId
    async deleteDate(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { contactId, dateId } = req.params;

            const result = await Contact.updateOne(
                { _id: contactId },
                { $pull: { importantDates: { _id: dateId } } }
            );

            if (result.matchedCount === 0) {
                res.status(404).json({
                    success: false,
                    error: { code: 'NOT_FOUND', message: 'Contact not found' }
                });
                return;
            }

            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }

    // POST /contacts/:contactId/dates/:dateId/send
    async sendEmailNow(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { contactId, dateId } = req.params;

            const scheduler = getEmailSchedulerService();
            const result = await scheduler.sendEmailNow(contactId, dateId);

            if (result.success) {
                res.json({
                    success: true,
                    data: {
                        messageId: result.messageId,
                        status: 'sent',
                        sentAt: result.sentAt
                    }
                });
            } else {
                res.status(500).json({
                    success: false,
                    error: { code: 'SEND_FAILED', message: result.error || 'Failed to send email' }
                });
            }
        } catch (error) {
            next(error);
        }
    }

    // GET /email-templates
    async listTemplates(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { type, isActive } = req.query;

            const query: Record<string, unknown> = {};
            if (type) query.type = type;
            if (isActive !== undefined) query.isActive = isActive === 'true';

            const templates = await EmailTemplate.find(query, {
                name: 1,
                description: 1,
                type: 1,
                isDefault: 1
            }).lean();

            res.json({
                success: true,
                data: templates
            });
        } catch (error) {
            next(error);
        }
    }

    // Helper: Calculate next send date
    private calculateNextSendDate(date: string, time: string): Date {
        const [day, month] = date.split('-').map(Number);
        const [hours, minutes] = time.split(':').map(Number);

        const now = new Date();
        const currentYear = now.getFullYear();

        let nextDate = new Date(currentYear, month - 1, day, hours, minutes);

        if (nextDate < now) {
            nextDate = new Date(currentYear + 1, month - 1, day, hours, minutes);
        }

        return nextDate;
    }
}

export default DatesController;
