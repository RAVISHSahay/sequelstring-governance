// server/src/validators/calls.validator.ts
// Validation Schemas for Calls API

import { z } from 'zod';

// List calls schema
export const listCallsSchema = {
    query: z.object({
        contactId: z.string().regex(/^[a-f\d]{24}$/i).optional(),
        accountId: z.string().regex(/^[a-f\d]{24}$/i).optional(),
        status: z.enum(['scheduled', 'in-progress', 'completed', 'missed', 'cancelled']).optional(),
        type: z.enum(['inbound', 'outbound', 'scheduled']).optional(),
        from: z.string().datetime().optional(),
        to: z.string().datetime().optional(),
        page: z.coerce.number().int().min(1).optional().default(1),
        limit: z.coerce.number().int().min(1).max(100).optional().default(20)
    })
};

// Schedule call schema
export const scheduleCallSchema = {
    body: z.object({
        contactId: z.string().regex(/^[a-f\d]{24}$/i, 'Invalid contact ID'),
        accountId: z.string().regex(/^[a-f\d]{24}$/i, 'Invalid account ID').optional(),
        scheduledAt: z.string().datetime('Invalid date format'),
        duration: z.number().int().min(1).max(480).optional(), // Max 8 hours
        type: z.enum(['inbound', 'outbound', 'scheduled']).optional().default('scheduled'),
        ctiProvider: z.enum(['twilio', 'vonage', 'zoom']).optional().default('twilio'),
        dialNumber: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number').optional(),
        notes: z.string().max(5000).optional()
    })
};

// Update call schema
export const updateCallSchema = {
    body: z.object({
        scheduledAt: z.string().datetime().optional(),
        notes: z.string().max(5000).optional(),
        tags: z.array(z.string().max(50)).max(20).optional(),
        status: z.enum(['scheduled', 'in-progress', 'completed', 'missed', 'cancelled']).optional()
    }).refine(data => Object.keys(data).length > 0, {
        message: 'At least one field must be provided'
    }),
    params: z.object({
        callId: z.string().regex(/^[a-f\d]{24}$/i, 'Invalid call ID')
    })
};

// Generate transcript schema
export const generateTranscriptSchema = {
    params: z.object({
        callId: z.string().regex(/^[a-f\d]{24}$/i, 'Invalid call ID')
    }),
    body: z.object({
        language: z.string().regex(/^[a-z]{2}-[A-Z]{2}$/).optional().default('en-US'),
        speakerDiarization: z.boolean().optional().default(true),
        punctuation: z.boolean().optional().default(true),
        profanityFilter: z.boolean().optional().default(false)
    }).optional()
};

// Generate AI summary schema
export const generateAISummarySchema = {
    params: z.object({
        callId: z.string().regex(/^[a-f\d]{24}$/i, 'Invalid call ID')
    }),
    body: z.object({
        model: z.enum(['gpt-4-turbo', 'gpt-4', 'gpt-3.5-turbo']).optional(),
        includeActionItems: z.boolean().optional().default(true),
        includeSentiment: z.boolean().optional().default(true),
        includeOpportunities: z.boolean().optional().default(true),
        language: z.string().optional()
    }).optional()
};

// Update action item schema
export const updateActionItemSchema = {
    params: z.object({
        callId: z.string().regex(/^[a-f\d]{24}$/i, 'Invalid call ID'),
        itemId: z.string().regex(/^[a-f\d]{24}$/i, 'Invalid action item ID')
    }),
    body: z.object({
        status: z.enum(['pending', 'in_progress', 'completed', 'cancelled']),
        assigneeId: z.string().regex(/^[a-f\d]{24}$/i).optional().nullable(),
        dueDate: z.string().datetime().optional().nullable(),
        completedAt: z.string().datetime().optional().nullable()
    })
};

export default {
    listCallsSchema,
    scheduleCallSchema,
    updateCallSchema,
    generateTranscriptSchema,
    generateAISummarySchema,
    updateActionItemSchema
};
