// server/src/validators/intelligence.validator.ts
// Validation Schemas for Intelligence API

import { z } from 'zod';

const newsCategories = [
    'earnings',
    'product_launch',
    'leadership',
    'ma',
    'funding',
    'partnership',
    'legal',
    'expansion',
    'layoffs',
    'other'
] as const;

// Get news feed schema
export const getNewsSchema = {
    params: z.object({
        accountId: z.string().regex(/^[a-f\d]{24}$/i, 'Invalid account ID')
    }),
    query: z.object({
        category: z.enum(newsCategories).optional(),
        sentiment: z.enum(['positive', 'neutral', 'negative']).optional(),
        search: z.string().max(200).optional(),
        limit: z.coerce.number().int().min(1).max(100).optional().default(20),
        offset: z.coerce.number().int().min(0).optional().default(0)
    })
};

// Alert action schema
export const alertActionSchema = {
    params: z.object({
        alertId: z.string().regex(/^[a-f\d]{24}$/i, 'Invalid alert ID')
    }),
    body: z.object({
        action: z.enum(['viewed', 'dismissed', 'shared', 'opportunity_created'], {
            required_error: 'Action is required'
        }),
        opportunityData: z.object({
            name: z.string().max(200),
            value: z.number().min(0),
            stage: z.string().max(50),
            probability: z.number().min(0).max(100).optional()
        }).optional()
    }).refine(data => {
        if (data.action === 'opportunity_created' && !data.opportunityData) {
            return false;
        }
        return true;
    }, {
        message: 'opportunityData is required when action is opportunity_created'
    })
};

// Subscription schema
export const subscriptionSchema = {
    body: z.object({
        accountId: z.string().regex(/^[a-f\d]{24}$/i, 'Invalid account ID'),
        enabled: z.boolean().optional().default(true),
        frequency: z.enum(['realtime', 'daily', 'weekly']).optional().default('daily'),
        keywords: z.array(z.string().max(100)).max(50).optional().default([]),
        competitors: z.array(z.string().max(200)).max(20).optional().default([]),
        categories: z.array(z.enum(newsCategories)).optional().default(['earnings', 'product_launch', 'leadership', 'ma']),
        notifyChannels: z.array(z.enum(['email', 'push', 'slack'])).optional().default(['push'])
    })
};

export default {
    getNewsSchema,
    alertActionSchema,
    subscriptionSchema
};
