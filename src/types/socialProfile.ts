// Social Profile Integration Types

export type SocialPlatform = 'linkedin' | 'twitter' | 'instagram' | 'youtube' | 'github' | 'facebook';

export type SocialEventType = 'new_post' | 'profile_update' | 'mention' | 'reaction' | 'new_connection' | 'job_change';

export type CommentStatus = 'queued' | 'sent' | 'failed' | 'assisted';

export interface SocialAccount {
    id: string;
    contactId: string;
    platform: SocialPlatform;
    platformUserId: string;
    handle: string;
    profileUrl: string;
    displayName?: string;
    bio?: string;
    profilePhotoUrl?: string;
    location?: string;
    company?: string;
    oauthTokenRef?: string; // Encrypted reference
    isConnected: boolean;
    lastSyncedAt?: string;
    status: 'active' | 'disconnected' | 'error';
    errorMessage?: string;
    syncFrequency: 'realtime' | 'hourly' | 'daily';
    createdAt: string;
    updatedAt: string;
}

export interface SocialEvent {
    id: string;
    contactId: string;
    socialAccountId: string;
    platform: SocialPlatform;
    eventType: SocialEventType;
    externalEventId: string; // Platform's post/event ID
    title: string;
    content: string;
    mediaUrls?: string[];
    eventUrl: string;
    eventTime: string;
    engagement?: {
        likes?: number;
        comments?: number;
        shares?: number;
    };
    isRead: boolean;
    isActionable: boolean;
    notificationSent: boolean;
    createdAt: string;
}

export interface SocialComment {
    id: string;
    socialEventId: string;
    postedByUserId: string; // CRM user who commented
    commentText: string;
    externalCommentId?: string; // Platform's comment ID
    status: CommentStatus;
    error?: string;
    commentUrl?: string;
    postedAt?: string;
    createdAt: string;
}

export interface SocialNotification {
    id: string;
    userId: string; // Assigned sales rep
    contactId: string;
    socialEventId: string;
    type: 'social_update';
    title: string;
    message: string;
    isRead: boolean;
    readAt?: string;
    createdAt: string;
}

export interface SocialProfileData {
    name?: string;
    headline?: string;
    bio?: string;
    company?: string;
    location?: string;
    profilePhoto?: string;
    followers?: number;
    connections?: number;
    email?: string;
    website?: string;
}

// Admin Settings
export interface SocialIntegrationSettings {
    id: string;
    platform: SocialPlatform;
    isEnabled: boolean;
    tier: 'tier1' | 'tier2' | 'tier3'; // Official API / Limited API / Manual only
    notificationFrequency: 'realtime' | 'hourly' | 'daily';
    whoCanConnect: 'sales_rep' | 'admin_only';
    commentTemplates: string[];
    rateLimitPerHour: number;
    requireApproval: boolean;
    createdAt: string;
    updatedAt: string;
}

// Supported platforms by tier
export const SOCIAL_PLATFORM_TIERS = {
    tier1: ['linkedin', 'twitter'] as SocialPlatform[],
    tier2: ['youtube', 'github'] as SocialPlatform[],
    tier3: ['instagram', 'facebook'] as SocialPlatform[]
};
