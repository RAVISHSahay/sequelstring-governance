// server/src/controllers/SocialController.ts
// Feature 2: Social Profile Controller

import { Request, Response, NextFunction } from 'express';
import { Contact } from '../models/Contact';
import { getSocialSyncService } from '../services/SocialSyncService';
import { SocialPlatform } from '../services/SocialSyncService';

export class SocialController {

    // GET /contacts/:contactId/social - List social profiles
    async listProfiles(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { contactId } = req.params;

            const contact = await Contact.findById(contactId, 'socialProfiles').lean();

            if (!contact) {
                res.status(404).json({
                    success: false,
                    error: { code: 'NOT_FOUND', message: 'Contact not found' }
                });
                return;
            }

            // Remove sensitive tokens from response
            const profiles = (contact.socialProfiles || []).map(profile => ({
                id: profile._id,
                platform: profile.platform,
                profileUrl: profile.profileUrl,
                displayName: profile.displayName,
                headline: profile.headline,
                avatarUrl: profile.avatarUrl,
                followers: profile.followers,
                connections: profile.connections,
                isVerified: profile.isVerified,
                lastSyncedAt: profile.lastSyncedAt,
                syncStatus: profile.syncStatus
            }));

            res.json({
                success: true,
                data: profiles
            });
        } catch (error) {
            next(error);
        }
    }

    // POST /contacts/:contactId/social - Connect new profile
    async connectProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { contactId } = req.params;
            const { platform, profileUrl } = req.body;

            // Verify contact exists
            const contact = await Contact.findById(contactId);
            if (!contact) {
                res.status(404).json({
                    success: false,
                    error: { code: 'NOT_FOUND', message: 'Contact not found' }
                });
                return;
            }

            // Check if profile already connected
            const existingProfile = contact.socialProfiles?.find(
                p => p.platform === platform
            );
            if (existingProfile) {
                res.status(400).json({
                    success: false,
                    error: { code: 'ALREADY_EXISTS', message: `${platform} profile already connected` }
                });
                return;
            }

            // Generate OAuth URL
            const socialService = getSocialSyncService();
            const state = Buffer.from(JSON.stringify({
                contactId,
                platform,
                profileUrl,
                userId: req.user!.id
            })).toString('base64');

            const redirectUri = `${process.env.API_URL}/api/v1/contacts/oauth/${platform}/callback`;
            const oauthUrl = socialService.getOAuthUrl(platform as SocialPlatform, redirectUri, state);

            res.status(201).json({
                success: true,
                data: {
                    platform,
                    oauthUrl,
                    status: 'pending_authorization',
                    message: 'Redirect user to OAuth URL to complete connection'
                }
            });
        } catch (error) {
            next(error);
        }
    }

    // DELETE /contacts/:contactId/social/:profileId - Disconnect profile
    async disconnectProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { contactId, profileId } = req.params;

            const socialService = getSocialSyncService();
            await socialService.disconnectProfile(contactId, profileId);

            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }

    // POST /contacts/:contactId/social/:profileId/sync - Force sync
    async forceSync(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { contactId, profileId } = req.params;

            // Get profile to determine platform
            const contact = await Contact.findOne(
                { _id: contactId, 'socialProfiles._id': profileId },
                { 'socialProfiles.$': 1 }
            );

            if (!contact?.socialProfiles?.length) {
                res.status(404).json({
                    success: false,
                    error: { code: 'NOT_FOUND', message: 'Social profile not found' }
                });
                return;
            }

            const profile = contact.socialProfiles[0];
            const socialService = getSocialSyncService();
            const jobId = await socialService.queueSync(
                contactId,
                profileId,
                profile.platform,
                'full'
            );

            res.json({
                success: true,
                data: {
                    jobId,
                    status: 'queued',
                    estimatedCompletion: new Date(Date.now() + 60000)
                }
            });
        } catch (error) {
            next(error);
        }
    }

    // GET /contacts/:contactId/social/activity - Get activity feed
    async getActivityFeed(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { contactId } = req.params;
            const { platform, limit = 20, cursor } = req.query;

            const socialService = getSocialSyncService();
            const activities = await socialService.getActivityFeed(contactId, {
                platform: platform as SocialPlatform | undefined,
                limit: Number(limit),
                cursor: cursor as string | undefined
            });

            res.json({
                success: true,
                data: activities,
                meta: {
                    nextCursor: activities.length === Number(limit)
                        ? activities[activities.length - 1].externalId
                        : null
                }
            });
        } catch (error) {
            next(error);
        }
    }

    // GET /oauth/linkedin/callback - LinkedIn OAuth callback
    async linkedInCallback(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { code, state, error, error_description } = req.query;

            if (error) {
                res.redirect(`${process.env.APP_URL}/social/error?message=${encodeURIComponent(error_description as string)}`);
                return;
            }

            // Decode state
            const stateData = JSON.parse(Buffer.from(state as string, 'base64').toString());
            const { contactId, platform, profileUrl } = stateData;

            // Exchange code for tokens
            const socialService = getSocialSyncService();
            const redirectUri = `${process.env.API_URL}/api/v1/contacts/oauth/linkedin/callback`;
            const tokens = await socialService.handleOAuthCallback('linkedin', code as string, redirectUri);

            // Connect profile
            await socialService.connectProfile(contactId, 'linkedin', profileUrl, tokens);

            // Redirect to success page
            res.redirect(`${process.env.APP_URL}/contacts/${contactId}?social=connected&platform=linkedin`);
        } catch (error) {
            res.redirect(`${process.env.APP_URL}/social/error?message=${encodeURIComponent('Failed to connect LinkedIn')}`);
        }
    }

    // GET /oauth/twitter/callback - Twitter OAuth callback
    async twitterCallback(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { code, state, error } = req.query;

            if (error) {
                res.redirect(`${process.env.APP_URL}/social/error?message=${encodeURIComponent(error as string)}`);
                return;
            }

            // Decode state
            const stateData = JSON.parse(Buffer.from(state as string, 'base64').toString());
            const { contactId, profileUrl } = stateData;

            // Exchange code for tokens
            const socialService = getSocialSyncService();
            const redirectUri = `${process.env.API_URL}/api/v1/contacts/oauth/twitter/callback`;
            const tokens = await socialService.handleOAuthCallback('twitter', code as string, redirectUri);

            // Connect profile
            await socialService.connectProfile(contactId, 'twitter', profileUrl, tokens);

            // Redirect to success page
            res.redirect(`${process.env.APP_URL}/contacts/${contactId}?social=connected&platform=twitter`);
        } catch (error) {
            res.redirect(`${process.env.APP_URL}/social/error?message=${encodeURIComponent('Failed to connect Twitter')}`);
        }
    }
}

export default SocialController;
