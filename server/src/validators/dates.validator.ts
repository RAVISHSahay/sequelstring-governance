// server/src/validators/dates.validator.ts
// Validation Schemas for Important Dates API

import { z } from 'zod';

// Create important date schema
export const createDateSchema = {
    body: z.object({
        type: z.enum(['birthday', 'anniversary', 'work_anniversary', 'custom'], {
            required_error: 'Date type is required'
        }),
        date: z.string().regex(/^\d{2}-\d{2}$/, 'Date must be in DD-MM format'),
        year: z.number().int().min(1900).max(2100).optional(),
        sendTime: z.string().regex(/^\d{2}:\d{2}$/, 'Time must be in HH:MM format').optional(),
        timezone: z.string().optional(),
        emailTemplateId: z.string().regex(/^[a-f\d]{24}$/i, 'Invalid template ID'),
        repeatAnnually: z.boolean().optional().default(true),
        customLabel: z.string().max(100).optional()
    }),
    params: z.object({
        contactId: z.string().regex(/^[a-f\d]{24}$/i, 'Invalid contact ID')
    })
};

// Update important date schema
export const updateDateSchema = {
    body: z.object({
        type: z.enum(['birthday', 'anniversary', 'work_anniversary', 'custom']).optional(),
        date: z.string().regex(/^\d{2}-\d{2}$/, 'Date must be in DD-MM format').optional(),
        year: z.number().int().min(1900).max(2100).optional().nullable(),
        sendTime: z.string().regex(/^\d{2}:\d{2}$/, 'Time must be in HH:MM format').optional(),
        timezone: z.string().optional(),
        emailTemplateId: z.string().regex(/^[a-f\d]{24}$/i, 'Invalid template ID').optional(),
        repeatAnnually: z.boolean().optional(),
        isActive: z.boolean().optional(),
        optOut: z.boolean().optional(),
        customLabel: z.string().max(100).optional()
    }).refine(data => Object.keys(data).length > 0, {
        message: 'At least one field must be provided'
    }),
    params: z.object({
        contactId: z.string().regex(/^[a-f\d]{24}$/i, 'Invalid contact ID'),
        dateId: z.string().regex(/^[a-f\d]{24}$/i, 'Invalid date ID')
    })
};

// Send email now schema
export const sendEmailSchema = {
    params: z.object({
        contactId: z.string().regex(/^[a-f\d]{24}$/i, 'Invalid contact ID'),
        dateId: z.string().regex(/^[a-f\d]{24}$/i, 'Invalid date ID')
    }),
    body: z.object({
        overrideTemplateId: z.string().regex(/^[a-f\d]{24}$/i).optional(),
        testMode: z.boolean().optional()
    }).optional()
};

export default {
    createDateSchema,
    updateDateSchema,
    sendEmailSchema
};
