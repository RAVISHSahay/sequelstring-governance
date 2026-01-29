import {
    SocialAccount,
    SocialEvent,
    SocialComment,
    SocialPlatform,
    SocialEventType
} from '@/types/socialProfile';

// Storage keys
const STORAGE_KEY_ACCOUNTS = 'crm_social_accounts';
const STORAGE_KEY_EVENTS = 'crm_social_events';
const STORAGE_KEY_COMMENTS = 'crm_social_comments';

// Generate unique ID
const generateId = () => `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

// Mock social accounts
export const mockSocialAccounts: SocialAccount[] = [
    {
        id: 'social_1',
        contactId: '1', // Rajesh Sharma
        platform: 'linkedin',
        platformUserId: 'rajesh-sharma-cto',
        handle: 'rajesh-sharma-cto',
        profileUrl: 'https://linkedin.com/in/rajesh-sharma-cto',
        displayName: 'Rajesh Sharma',
        bio: 'CTO at Tata Steel | Digital Transformation Leader | Industry 4.0 Enthusiast',
        profilePhotoUrl: 'https://ui-avatars.com/api/?name=Rajesh+Sharma',
        location: 'Mumbai, India',
        company: 'Tata Steel Ltd',
        isConnected: true,
        lastSyncedAt: new Date('2026-01-28T10:00:00').toISOString(),
        status: 'active',
        syncFrequency: 'daily',
        createdAt: new Date('2026-01-15').toISOString(),
        updatedAt: new Date('2026-01-28').toISOString(),
    },
    {
        id: 'social_2',
        contactId: '1',
        platform: 'twitter',
        platformUserId: 'rajesh_sharma_cto',
        handle: '@rajesh_sharma_cto',
        profileUrl: 'https://twitter.com/rajesh_sharma_cto',
        displayName: 'Rajesh Sharma',
        bio: 'CTO @TataSteel | Tech enthusiast | Speaker',
        isConnected: true,
        lastSyncedAt: new Date('2026-01-28T10:00:00').toISOString(),
        status: 'active',
        syncFrequency: 'hourly',
        createdAt: new Date('2026-01-15').toISOString(),
        updatedAt: new Date('2026-01-28').toISOString(),
    },
    {
        id: 'social_3',
        contactId: '2', // Priya Mehta
        platform: 'linkedin',
        platformUserId: 'priya-mehta-infosys',
        handle: 'priya-mehta-infosys',
        profileUrl: 'https://linkedin.com/in/priya-mehta-infosys',
        displayName: 'Priya Mehta',
        bio: 'VP Engineering at Infosys | Cloud & AI Expert',
        location: 'Bangalore, India',
        company: 'Infosys',
        isConnected: true,
        lastSyncedAt: new Date('2026-01-27T15:00:00').toISOString(),
        status: 'active',
        syncFrequency: 'daily',
        createdAt: new Date('2026-01-10').toISOString(),
        updatedAt: new Date('2026-01-27').toISOString(),
    },
];

// Mock social events (posts, updates)
export const mockSocialEvents: SocialEvent[] = [
    {
        id: 'event_1',
        contactId: '1',
        socialAccountId: 'social_1',
        platform: 'linkedin',
        eventType: 'new_post',
        externalEventId: 'li_post_123456',
        title: 'New LinkedIn Post',
        content: 'Excited to announce that Tata Steel has achieved a new milestone in sustainable steel production! Our hydrogen-based initiative is now operational. #GreenSteel #Sustainability #Innovation',
        eventUrl: 'https://linkedin.com/posts/rajesh-sharma-cto_123456',
        eventTime: new Date('2026-01-28T09:30:00').toISOString(),
        engagement: {
            likes: 245,
            comments: 32,
            shares: 18,
        },
        isRead: false,
        isActionable: true,
        notificationSent: true,
        createdAt: new Date('2026-01-28T09:35:00').toISOString(),
    },
    {
        id: 'event_2',
        contactId: '1',
        socialAccountId: 'social_2',
        platform: 'twitter',
        eventType: 'new_post',
        externalEventId: 'tweet_789012',
        title: 'New Tweet',
        content: 'Great session at the Industry 4.0 Summit today. Key takeaway: AI and automation are transforming manufacturing faster than ever. #Industry40 #AI #Manufacturing',
        eventUrl: 'https://twitter.com/rajesh_sharma_cto/status/789012',
        eventTime: new Date('2026-01-27T16:00:00').toISOString(),
        engagement: {
            likes: 89,
            comments: 12,
            shares: 5,
        },
        isRead: true,
        isActionable: true,
        notificationSent: true,
        createdAt: new Date('2026-01-27T16:05:00').toISOString(),
    },
    {
        id: 'event_3',
        contactId: '1',
        socialAccountId: 'social_1',
        platform: 'linkedin',
        eventType: 'job_change',
        externalEventId: 'li_update_345678',
        title: 'Profile Update',
        content: 'Rajesh Sharma updated their position: Now serving as Group CTO (promoted from CTO)',
        eventUrl: 'https://linkedin.com/in/rajesh-sharma-cto',
        eventTime: new Date('2026-01-25T11:00:00').toISOString(),
        isRead: true,
        isActionable: true,
        notificationSent: true,
        createdAt: new Date('2026-01-25T11:30:00').toISOString(),
    },
    {
        id: 'event_4',
        contactId: '2',
        socialAccountId: 'social_3',
        platform: 'linkedin',
        eventType: 'new_post',
        externalEventId: 'li_post_901234',
        title: 'New LinkedIn Post',
        content: 'Thrilled to share that our team successfully migrated 500+ applications to the cloud this quarter. Huge thanks to everyone involved! #CloudTransformation #Infosys',
        eventUrl: 'https://linkedin.com/posts/priya-mehta-infosys_901234',
        eventTime: new Date('2026-01-26T14:00:00').toISOString(),
        engagement: {
            likes: 178,
            comments: 24,
            shares: 9,
        },
        isRead: false,
        isActionable: true,
        notificationSent: true,
        createdAt: new Date('2026-01-26T14:05:00').toISOString(),
    },
];

// CRUD Operations for Social Accounts
export const getSocialAccounts = (): SocialAccount[] => {
    const stored = localStorage.getItem(STORAGE_KEY_ACCOUNTS);
    if (stored) {
        return JSON.parse(stored);
    }
    localStorage.setItem(STORAGE_KEY_ACCOUNTS, JSON.stringify(mockSocialAccounts));
    return mockSocialAccounts;
};

export const getSocialAccountsByContactId = (contactId: string): SocialAccount[] => {
    const allAccounts = getSocialAccounts();
    return allAccounts.filter(acc => acc.contactId === contactId);
};

export const connectSocialAccount = (account: Omit<SocialAccount, 'id' | 'createdAt' | 'updatedAt'>): SocialAccount => {
    const allAccounts = getSocialAccounts();
    const newAccount: SocialAccount = {
        ...account,
        id: `social_${generateId()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
    allAccounts.push(newAccount);
    localStorage.setItem(STORAGE_KEY_ACCOUNTS, JSON.stringify(allAccounts));
    return newAccount;
};

export const disconnectSocialAccount = (id: string): boolean => {
    const allAccounts = getSocialAccounts();
    const index = allAccounts.findIndex(a => a.id === id);
    if (index === -1) return false;

    allAccounts[index].isConnected = false;
    allAccounts[index].status = 'disconnected';
    allAccounts[index].updatedAt = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY_ACCOUNTS, JSON.stringify(allAccounts));
    return true;
};

export const deleteSocialAccount = (id: string): boolean => {
    const allAccounts = getSocialAccounts();
    const filtered = allAccounts.filter(a => a.id !== id);
    if (filtered.length === allAccounts.length) return false;
    localStorage.setItem(STORAGE_KEY_ACCOUNTS, JSON.stringify(filtered));
    return true;
};

// CRUD Operations for Social Events
export const getSocialEvents = (): SocialEvent[] => {
    const stored = localStorage.getItem(STORAGE_KEY_EVENTS);
    if (stored) {
        return JSON.parse(stored);
    }
    localStorage.setItem(STORAGE_KEY_EVENTS, JSON.stringify(mockSocialEvents));
    return mockSocialEvents;
};

export const getEventsByContactId = (contactId: string): SocialEvent[] => {
    const allEvents = getSocialEvents();
    return allEvents
        .filter(event => event.contactId === contactId)
        .sort((a, b) => new Date(b.eventTime).getTime() - new Date(a.eventTime).getTime());
};

export const getUnreadEventsCount = (contactId?: string): number => {
    const allEvents = getSocialEvents();
    return allEvents.filter(event =>
        !event.isRead &&
        (!contactId || event.contactId === contactId)
    ).length;
};

export const markEventAsRead = (id: string): boolean => {
    const allEvents = getSocialEvents();
    const index = allEvents.findIndex(e => e.id === id);
    if (index === -1) return false;

    allEvents[index].isRead = true;
    localStorage.setItem(STORAGE_KEY_EVENTS, JSON.stringify(allEvents));
    return true;
};

export const markAllEventsAsRead = (contactId: string): void => {
    const allEvents = getSocialEvents();
    allEvents.forEach(event => {
        if (event.contactId === contactId) {
            event.isRead = true;
        }
    });
    localStorage.setItem(STORAGE_KEY_EVENTS, JSON.stringify(allEvents));
};

// Social Comments
export const getSocialComments = (): SocialComment[] => {
    const stored = localStorage.getItem(STORAGE_KEY_COMMENTS);
    return stored ? JSON.parse(stored) : [];
};

export const addSocialComment = (comment: Omit<SocialComment, 'id' | 'createdAt'>): SocialComment => {
    const allComments = getSocialComments();
    const newComment: SocialComment = {
        ...comment,
        id: `comment_${generateId()}`,
        createdAt: new Date().toISOString(),
    };
    allComments.push(newComment);
    localStorage.setItem(STORAGE_KEY_COMMENTS, JSON.stringify(allComments));
    return newComment;
};

// Simulate OAuth connect (returns mock profile data)
export const simulateOAuthConnect = (platform: SocialPlatform, profileUrl: string): Promise<{
    success: boolean;
    account?: Partial<SocialAccount>;
    error?: string;
}> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            // Simulate 90% success rate
            if (Math.random() > 0.1) {
                const handle = profileUrl.split('/').pop() || 'user';
                resolve({
                    success: true,
                    account: {
                        platform,
                        platformUserId: handle,
                        handle: platform === 'twitter' ? `@${handle}` : handle,
                        profileUrl,
                        displayName: handle.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
                        isConnected: true,
                        status: 'active',
                        lastSyncedAt: new Date().toISOString(),
                        syncFrequency: 'daily',
                    },
                });
            } else {
                resolve({
                    success: false,
                    error: 'Failed to authenticate with platform. Please try again.',
                });
            }
        }, 1500);
    });
};

// Get platform icon/color
export const getPlatformInfo = (platform: SocialPlatform): {
    name: string;
    color: string;
    bgColor: string;
} => {
    const info: Record<SocialPlatform, { name: string; color: string; bgColor: string }> = {
        linkedin: { name: 'LinkedIn', color: '#0077B5', bgColor: 'bg-[#0077B5]/10' },
        twitter: { name: 'X (Twitter)', color: '#1DA1F2', bgColor: 'bg-[#1DA1F2]/10' },
        instagram: { name: 'Instagram', color: '#E4405F', bgColor: 'bg-[#E4405F]/10' },
        youtube: { name: 'YouTube', color: '#FF0000', bgColor: 'bg-[#FF0000]/10' },
        github: { name: 'GitHub', color: '#181717', bgColor: 'bg-[#181717]/10' },
        facebook: { name: 'Facebook', color: '#1877F2', bgColor: 'bg-[#1877F2]/10' },
    };
    return info[platform];
};
