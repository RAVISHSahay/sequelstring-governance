// Public Domain Intelligence Types

export type NewsRelevance = 'High' | 'Medium' | 'Low';
export type NewsTag = 'Funding' | 'Contract' | 'Leadership Change' | 'Litigation' | 'Product Launch' | 'Earnings' | 'M&A' | 'Cyber Incident' | 'Award' | 'Partnership' | 'Expansion' | 'Layoffs' | 'Other';

export type IntelType = 'competitor' | 'pricing' | 'product' | 'techstack' | 'partnership' | 'procurement' | 'winloss' | 'market_trend';

export type ConfidenceLevel = 'High' | 'Medium' | 'Low';
export type SourceType = 'Public' | 'Partner' | 'Customer Feedback' | 'Sales Observation' | 'Market Research';
export type IntelVisibility = 'intelligence_only' | 'sales_visible' | 'all';

export interface AccountNewsItem {
    id: string;
    accountId: string;
    title: string;
    summary: string;
    sourceName: string;
    sourceUrl: string;
    publishedAt: string;
    ingestedAt: string;
    tags: NewsTag[];
    relevanceScore: NewsRelevance;
    matchedTerms: string[]; // Which alias/keyword triggered the match
    status: 'active' | 'dismissed' | 'saved' | 'archived';
    isDuplicate: boolean;
    canonicalUrlHash?: string;
    imageUrl?: string;
    dismissedBy?: string;
    dismissedAt?: string;
    createdAt: string;
    updatedAt: string;
}

export interface AccountNewsSubscription {
    id: string;
    accountId: string;
    userId?: string; // null = team-wide
    teamId?: string;

    // Subscription config
    includeCompanyName: boolean;
    includeNameVariants: boolean;
    nameVariants: string[]; // ["Ltd", "Inc", abbreviations]
    includeSubsidiaries: boolean;
    subsidiaryNames: string[];
    includeCompetitorMentions: boolean;

    // Keyword filters
    includeKeywords: string[];
    excludeKeywords: string[];

    // Delivery settings
    frequency: 'realtime' | 'hourly' | 'daily' | 'weekly';
    channels: ('crm' | 'email')[];
    isEnabled: boolean;

    // Metadata
    createdBy: string;
    createdAt: string;
    updatedAt: string;
}

export interface AccountIntelEntry {
    id: string;
    accountId: string;
    intelType: IntelType;
    title: string;
    content: string; // Rich text
    tags: string[];
    competitorAccountId?: string; // Link to competitor account

    // Quality indicators
    confidenceLevel: ConfidenceLevel;
    sourceType: SourceType;
    sourceName?: string;
    sourceUrl?: string;

    // Visibility & lifecycle
    visibility: IntelVisibility;
    validFrom: string;
    reviewDueAt?: string;
    isArchived: boolean;

    // Audit
    createdBy: string;
    updatedBy?: string;
    approvedBy?: string;
    approvedAt?: string;
    createdAt: string;
    updatedAt: string;
}

export interface CompetitorProfile {
    id: string;
    accountId: string; // The account we're tracking this for
    competitorAccountId?: string; // Link to competitor's account record
    competitorName: string;

    // Competitive positioning
    positioning: string;
    strengths: string[];
    weaknesses: string[];

    // Pricing intel
    pricingRange?: string;
    pricingModel?: string;
    discountBehavior?: string;

    // Win/Loss
    winRate?: number;
    commonWinReasons: string[];
    commonLossReasons: string[];

    // Metadata
    lastUpdated: string;
    updatedBy: string;
}

export interface TechStackEntry {
    id: string;
    accountId: string;
    category: 'ERP' | 'CRM' | 'RPA' | 'OCR' | 'Cloud' | 'BI' | 'Analytics' | 'Security' | 'Communication' | 'Other';
    technology: string;
    vendor: string;
    version?: string;
    deploymentDate?: string;
    confidence: ConfidenceLevel;
    source: SourceType;
    notes?: string;
    createdBy: string;
    createdAt: string;
    updatedAt: string;
}

export interface NewsSource {
    id: string;
    name: string;
    domain: string;
    sourceType: 'RSS' | 'API' | 'Manual' | 'News Aggregator';
    isWhitelisted: boolean;
    trustScore: number; // 0-100
    rateLimit: number; // items per day
    lastFetchedAt?: string;
    isActive: boolean;
    createdAt: string;
}

export interface NewsNotification {
    id: string;
    userId: string; // Sales rep
    accountId: string;
    newsItemId: string;
    type: 'social_update' | 'news_alert' | 'intel_request';
    title: string;
    message: string;
    priority: 'high' | 'medium' | 'low';
    isRead: boolean;
    readAt?: string;
    actionTaken?: 'task_created' | 'opportunity_created' | 'shared' | 'dismissed';
    createdAt: string;
}

// Admin settings
export interface IntelligenceSettings {
    autoNewsIngestion: boolean;
    whitelistedSources: string[];
    blacklistedDomains: string[];
    maxNewsPerAccount: number;
    digestBatchSize: number;
    requireIntelApproval: boolean;
    defaultReviewPeriodDays: number;
    enableCompetitiveIntel: boolean;
    salesCanViewConfidentialIntel: boolean;
}

export const NEWS_TAGS: NewsTag[] = [
    'Funding',
    'Contract',
    'Leadership Change',
    'Litigation',
    'Product Launch',
    'Earnings',
    'M&A',
    'Cyber Incident',
    'Award',
    'Partnership',
    'Expansion',
    'Layoffs',
    'Other'
];
