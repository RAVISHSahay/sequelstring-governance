// server/src/services/SocialSyncService.ts
// Feature 2: Social Profile Integration Service

import Bull, { Queue, Job } from 'bull';
import { Contact, IContact, ISocialProfile } from '../models/Contact';
import { SocialActivity } from '../models/SocialActivity';
import { LinkedInAdapter } from '../integrations/linkedin/LinkedInAdapter';
import { TwitterAdapter } from '../integrations/twitter/TwitterAdapter';
import { RedisClient } from '../config/redis';
import { Logger } from '../utils/logger';
import { CryptoService } from '../utils/crypto';

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

export type SocialPlatform = 'linkedin' | 'twitter' | 'facebook';

export interface OAuthTokens {
    accessToken: string;
    refreshToken?: string;
    expiresAt?: Date;
    scope?: string[];
}

export interface ProfileData {
    profileId: string;
    displayName: string;
    headline?: string;
    avatarUrl?: string;
    followers?: number;
    connections?: number;
    profileUrl: string;
}

export interface SocialPost {
    externalId: string;
    platform: SocialPlatform;
    type: 'post' | 'share' | 'like' | 'comment' | 'article';
    content: {
        text: string;
        imageUrls?: string[];
        linkUrl?: string;
        linkTitle?: string;
    };
    engagement: {
        likes: number;
        comments: number;
        shares: number;
        views?: number;
    };
    publishedAt: Date;
}

export interface SyncJobData {
    contactId: string;
    profileId: string;
    platform: SocialPlatform;
    syncType: 'full' | 'incremental';
    accessToken: string;
}

export interface SyncResult {
    success: boolean;
    profileUpdated: boolean;
    activitiesAdded: number;
    errors?: string[];
}

// =============================================================================
// SOCIAL SYNC SERVICE
// =============================================================================

export class SocialSyncService {
    private syncQueue: Queue<SyncJobData>;
    private linkedIn: LinkedInAdapter;
    private twitter: TwitterAdapter;
    private crypto: CryptoService;
    private logger: Logger;

    // Rate limit tracking
    private rateLimits: Map<string, { remaining: number; resetAt: Date }> = new Map();

    constructor() {
        this.logger = new Logger('SocialSyncService');
        this.crypto = new CryptoService();
        this.linkedIn = new LinkedInAdapter();
        this.twitter = new TwitterAdapter();

        // Initialize Bull queue
        this.syncQueue = new Bull('social-sync-queue', {
            redis: RedisClient.getConfig(),
            defaultJobOptions: {
                attempts: 3,
                backoff: {
                    type: 'exponential',
                    delay: 30000 // 30 seconds - respect rate limits
                },
                removeOnComplete: 50,
                removeOnFail: 100
            },
            limiter: {
                max: 10, // Max 10 jobs per minute
                duration: 60000
            }
        });

        this.setupQueueHandlers();
    }

    // ===========================================================================
    // QUEUE HANDLERS
    // ===========================================================================

    private setupQueueHandlers(): void {
        // Process sync jobs (1 concurrent to respect rate limits)
        this.syncQueue.process('sync-profile', 1, async (job: Job<SyncJobData>) => {
            return this.processSyncJob(job);
        });

        this.syncQueue.on('completed', (job: Job<SyncJobData>, result: SyncResult) => {
            this.logger.info('Social sync completed', {
                jobId: job.id,
                contactId: job.data.contactId,
                platform: job.data.platform,
                activitiesAdded: result.activitiesAdded
            });
        });

        this.syncQueue.on('failed', (job: Job<SyncJobData>, error: Error) => {
            this.logger.error('Social sync failed', {
                jobId: job.id,
                contactId: job.data.contactId,
                platform: job.data.platform,
                error: error.message
            });
        });
    }

    // ===========================================================================
    // OAUTH FLOW
    // ===========================================================================

    public getOAuthUrl(platform: SocialPlatform, redirectUri: string, state: string): string {
        switch (platform) {
            case 'linkedin':
                return this.linkedIn.getAuthorizationUrl(redirectUri, state);
            case 'twitter':
                return this.twitter.getAuthorizationUrl(redirectUri, state);
            default:
                throw new Error(`Unsupported platform: ${platform}`);
        }
    }

    public async handleOAuthCallback(
        platform: SocialPlatform,
        code: string,
        redirectUri: string
    ): Promise<OAuthTokens> {
        let tokens: OAuthTokens;

        switch (platform) {
            case 'linkedin':
                tokens = await this.linkedIn.exchangeCode(code, redirectUri);
                break;
            case 'twitter':
                tokens = await this.twitter.exchangeCode(code, redirectUri);
                break;
            default:
                throw new Error(`Unsupported platform: ${platform}`);
        }

        return tokens;
    }

    public async refreshToken(
        platform: SocialPlatform,
        refreshToken: string
    ): Promise<OAuthTokens> {
        switch (platform) {
            case 'linkedin':
                return this.linkedIn.refreshAccessToken(refreshToken);
            case 'twitter':
                return this.twitter.refreshAccessToken(refreshToken);
            default:
                throw new Error(`Unsupported platform: ${platform}`);
        }
    }

    // ===========================================================================
    // PROFILE MANAGEMENT
    // ===========================================================================

    public async connectProfile(
        contactId: string,
        platform: SocialPlatform,
        profileUrl: string,
        tokens: OAuthTokens
    ): Promise<ISocialProfile> {
        this.logger.info('Connecting social profile', { contactId, platform, profileUrl });

        // Fetch profile data from platform
        const profileData = await this.fetchProfileData(platform, tokens.accessToken);

        // Encrypt tokens
        const encryptedAccess = this.crypto.encrypt(tokens.accessToken);
        const encryptedRefresh = tokens.refreshToken
            ? this.crypto.encrypt(tokens.refreshToken)
            : undefined;

        // Create social profile object
        const socialProfile: ISocialProfile = {
            platform,
            profileUrl,
            profileId: profileData.profileId,
            displayName: profileData.displayName,
            headline: profileData.headline,
            avatarUrl: profileData.avatarUrl,
            followers: profileData.followers,
            connections: profileData.connections,
            isVerified: true,
            accessToken: encryptedAccess,
            refreshToken: encryptedRefresh,
            tokenExpiresAt: tokens.expiresAt,
            lastSyncedAt: new Date(),
            syncStatus: 'success',
            createdAt: new Date()
        };

        // Add to contact
        await Contact.updateOne(
            { _id: contactId },
            { $push: { socialProfiles: socialProfile } }
        );

        // Queue initial sync for activity feed
        await this.queueSync(contactId, socialProfile._id!.toString(), platform, 'full');

        return socialProfile;
    }

    public async disconnectProfile(contactId: string, profileId: string): Promise<void> {
        this.logger.info('Disconnecting social profile', { contactId, profileId });

        // Remove from contact
        await Contact.updateOne(
            { _id: contactId },
            { $pull: { socialProfiles: { _id: profileId } } }
        );

        // Delete related activities
        await SocialActivity.deleteMany({ socialProfileId: profileId });
    }

    private async fetchProfileData(
        platform: SocialPlatform,
        accessToken: string
    ): Promise<ProfileData> {
        switch (platform) {
            case 'linkedin':
                return this.linkedIn.getProfile(accessToken);
            case 'twitter':
                return this.twitter.getProfile(accessToken);
            default:
                throw new Error(`Unsupported platform: ${platform}`);
        }
    }

    // ===========================================================================
    // SYNC OPERATIONS
    // ===========================================================================

    public async queueSync(
        contactId: string,
        profileId: string,
        platform: SocialPlatform,
        syncType: 'full' | 'incremental' = 'incremental'
    ): Promise<string> {
        // Get encrypted access token
        const contact = await Contact.findOne(
            { _id: contactId, 'socialProfiles._id': profileId },
            { 'socialProfiles.$': 1 }
        );

        if (!contact?.socialProfiles?.length) {
            throw new Error('Social profile not found');
        }

        const profile = contact.socialProfiles[0];
        if (!profile.accessToken) {
            throw new Error('No access token available');
        }

        // Check if token needs refresh
        if (profile.tokenExpiresAt && profile.tokenExpiresAt < new Date()) {
            await this.refreshAndUpdateToken(contactId, profileId, platform, profile.refreshToken!);
        }

        // Decrypt access token
        const accessToken = this.crypto.decrypt(profile.accessToken);

        const job = await this.syncQueue.add('sync-profile', {
            contactId,
            profileId,
            platform,
            syncType,
            accessToken
        }, {
            jobId: `sync:${contactId}:${profileId}:${Date.now()}`
        });

        return job.id?.toString() || '';
    }

    private async processSyncJob(job: Job<SyncJobData>): Promise<SyncResult> {
        const { contactId, profileId, platform, syncType, accessToken } = job.data;
        const result: SyncResult = {
            success: false,
            profileUpdated: false,
            activitiesAdded: 0,
            errors: []
        };

        try {
            // Check rate limits
            await this.waitForRateLimit(platform);

            // Fetch updated profile data
            const profileData = await this.fetchProfileData(platform, accessToken);

            // Update profile in database
            await Contact.updateOne(
                { _id: contactId, 'socialProfiles._id': profileId },
                {
                    $set: {
                        'socialProfiles.$.displayName': profileData.displayName,
                        'socialProfiles.$.headline': profileData.headline,
                        'socialProfiles.$.avatarUrl': profileData.avatarUrl,
                        'socialProfiles.$.followers': profileData.followers,
                        'socialProfiles.$.connections': profileData.connections,
                        'socialProfiles.$.lastSyncedAt': new Date(),
                        'socialProfiles.$.syncStatus': 'success'
                    }
                }
            );
            result.profileUpdated = true;

            // Fetch and store activities
            const activities = await this.fetchActivities(platform, accessToken, syncType);

            for (const activity of activities) {
                try {
                    await this.storeActivity(contactId, profileId, platform, activity);
                    result.activitiesAdded++;
                } catch (error) {
                    result.errors?.push(`Failed to store activity: ${(error as Error).message}`);
                }
            }

            result.success = true;
            return result;

        } catch (error) {
            // Update sync status to failed
            await Contact.updateOne(
                { _id: contactId, 'socialProfiles._id': profileId },
                {
                    $set: {
                        'socialProfiles.$.syncStatus': 'failed',
                        'socialProfiles.$.lastSyncedAt': new Date()
                    }
                }
            );

            throw error;
        }
    }

    private async fetchActivities(
        platform: SocialPlatform,
        accessToken: string,
        syncType: 'full' | 'incremental'
    ): Promise<SocialPost[]> {
        const limit = syncType === 'full' ? 50 : 10;

        switch (platform) {
            case 'linkedin':
                return this.linkedIn.getActivities(accessToken, limit);
            case 'twitter':
                return this.twitter.getTweets(accessToken, limit);
            default:
                return [];
        }
    }

    private async storeActivity(
        contactId: string,
        profileId: string,
        platform: SocialPlatform,
        post: SocialPost
    ): Promise<void> {
        // Upsert to avoid duplicates
        await SocialActivity.updateOne(
            { externalId: post.externalId, platform },
            {
                $set: {
                    contactId,
                    socialProfileId: profileId,
                    platform,
                    externalId: post.externalId,
                    type: post.type,
                    content: post.content,
                    engagement: post.engagement,
                    publishedAt: post.publishedAt,
                    fetchedAt: new Date()
                }
            },
            { upsert: true }
        );
    }

    // ===========================================================================
    // TOKEN MANAGEMENT
    // ===========================================================================

    private async refreshAndUpdateToken(
        contactId: string,
        profileId: string,
        platform: SocialPlatform,
        encryptedRefreshToken: string
    ): Promise<void> {
        const refreshToken = this.crypto.decrypt(encryptedRefreshToken);
        const newTokens = await this.refreshToken(platform, refreshToken);

        await Contact.updateOne(
            { _id: contactId, 'socialProfiles._id': profileId },
            {
                $set: {
                    'socialProfiles.$.accessToken': this.crypto.encrypt(newTokens.accessToken),
                    'socialProfiles.$.refreshToken': newTokens.refreshToken
                        ? this.crypto.encrypt(newTokens.refreshToken)
                        : undefined,
                    'socialProfiles.$.tokenExpiresAt': newTokens.expiresAt
                }
            }
        );
    }

    // ===========================================================================
    // RATE LIMITING
    // ===========================================================================

    private async waitForRateLimit(platform: SocialPlatform): Promise<void> {
        const limit = this.rateLimits.get(platform);

        if (limit && limit.remaining <= 0 && limit.resetAt > new Date()) {
            const waitTime = limit.resetAt.getTime() - Date.now();
            this.logger.info(`Rate limited, waiting ${waitTime}ms for ${platform}`);
            await new Promise(resolve => setTimeout(resolve, waitTime));
        }
    }

    public updateRateLimit(platform: SocialPlatform, remaining: number, resetAt: Date): void {
        this.rateLimits.set(platform, { remaining, resetAt });
    }

    // ===========================================================================
    // ACTIVITY FEED
    // ===========================================================================

    public async getActivityFeed(
        contactId: string,
        options: {
            platform?: SocialPlatform;
            limit?: number;
            cursor?: string;
        } = {}
    ): Promise<SocialPost[]> {
        const query: Record<string, unknown> = { contactId };

        if (options.platform) {
            query.platform = options.platform;
        }

        if (options.cursor) {
            query._id = { $lt: options.cursor };
        }

        const activities = await SocialActivity.find(query)
            .sort({ publishedAt: -1 })
            .limit(options.limit || 20)
            .lean();

        return activities;
    }

    // ===========================================================================
    // SCHEDULED SYNC
    // ===========================================================================

    public async schedulePeriodicSync(): Promise<void> {
        // Find all contacts with active social profiles
        const contacts = await Contact.find({
            'socialProfiles.isVerified': true,
            'socialProfiles.syncStatus': { $ne: 'failed' }
        }, {
            _id: 1,
            socialProfiles: 1
        }).lean<IContact[]>();

        let scheduledCount = 0;

        for (const contact of contacts) {
            for (const profile of contact.socialProfiles || []) {
                // Only sync if last sync was more than 6 hours ago
                const sixHoursAgo = new Date(Date.now() - 6 * 60 * 60 * 1000);

                if (!profile.lastSyncedAt || profile.lastSyncedAt < sixHoursAgo) {
                    await this.queueSync(
                        contact._id.toString(),
                        profile._id!.toString(),
                        profile.platform,
                        'incremental'
                    );
                    scheduledCount++;
                }
            }
        }

        this.logger.info('Periodic sync scheduled', { scheduledCount });
    }

    // ===========================================================================
    // MANAGEMENT
    // ===========================================================================

    public async getQueueStats(): Promise<{
        waiting: number;
        active: number;
        completed: number;
        failed: number;
    }> {
        const [waiting, active, completed, failed] = await Promise.all([
            this.syncQueue.getWaitingCount(),
            this.syncQueue.getActiveCount(),
            this.syncQueue.getCompletedCount(),
            this.syncQueue.getFailedCount()
        ]);

        return { waiting, active, completed, failed };
    }

    public async shutdown(): Promise<void> {
        await this.syncQueue.close();
        this.logger.info('Social Sync Service shut down');
    }
}

// =============================================================================
// SINGLETON EXPORT
// =============================================================================

let instance: SocialSyncService | null = null;

export function getSocialSyncService(): SocialSyncService {
    if (!instance) {
        instance = new SocialSyncService();
    }
    return instance;
}

export default SocialSyncService;
