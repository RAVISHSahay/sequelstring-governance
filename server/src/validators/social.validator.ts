// server/src/validators/social.validator.ts
// Validation Schemas for Social Profile API

import { z } from 'zod';

// Connect profile schema
export const connectProfileSchema = {
    params: z.object({
        contactId: z.string().regex(/^[a-f\d]{24}$/i, 'Invalid contact ID')
    }),
    body: z.object({
        platform: z.enum(['linkedin', 'twitter', 'facebook'], {
            required_error: 'Platform is required'
        }),
        profileUrl: z.string().url('Invalid profile URL').refine(url => {
            if (url.includes('linkedin.com')) return true;
            if (url.includes('twitter.com') || url.includes('x.com')) return true;
            if (url.includes('facebook.com')) return true;
            return false;
        }, 'URL must be from a supported platform')
    })
};

// Sync profile schema
export const syncProfileSchema = {
    params: z.object({
        contactId: z.string().regex(/^[a-f\d]{24}$/i, 'Invalid contact ID'),
        profileId: z.string().regex(/^[a-f\d]{24}$/i, 'Invalid profile ID')
    }),
    body: z.object({
        syncType: z.enum(['full', 'incremental']).optional().default('incremental')
    }).optional()
};

export default {
    connectProfileSchema,
    syncProfileSchema
};
