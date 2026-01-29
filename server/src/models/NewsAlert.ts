// server/src/models/NewsAlert.ts
// MongoDB NewsAlert Model for Public Domain Intelligence

import mongoose, { Document, Schema, Types } from 'mongoose';

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

export type NewsCategory =
    | 'earnings'
    | 'product_launch'
    | 'ma'
    | 'leadership'
    | 'regulatory'
    | 'market';

export type SentimentLabel = 'positive' | 'neutral' | 'negative';

export interface ISentimentAnalysis {
    label: SentimentLabel;
    score: number; // -1 to 1
}

export interface IEntity {
    name: string;
    type: 'company' | 'person' | 'location' | 'product';
    role?: string;
}

export interface IAnalysis {
    sentiment: ISentimentAnalysis;
    relevanceScore: number; // 0-100
    entities: IEntity[];
    keywords: string[];
    topics: string[];
}

export interface IInteraction {
    userId: Types.ObjectId;
    action: 'viewed' | 'shared' | 'dismissed' | 'opportunity_created';
    timestamp: Date;
    opportunityId?: Types.ObjectId;
    metadata?: Record<string, unknown>;
}

export interface INewsAlert extends Document {
    _id: Types.ObjectId;
    accountId: Types.ObjectId;

    // Article Details
    title: string;
    summary: string;
    content?: string;
    sourceUrl: string;
    sourceName: string;
    sourceType: 'news' | 'press_release' | 'blog' | 'social';
    publishedAt: Date;

    // Media
    imageUrl?: string;
    thumbnailUrl?: string;

    // Classification
    category: NewsCategory;
    subcategory?: string;
    tags: string[];

    // AI Analysis
    analysis: IAnalysis;

    // User Interactions
    interactions: IInteraction[];

    // Status
    isActive: boolean;
    isRead: boolean;
    isDismissed: boolean;

    // Metadata
    expiresAt: Date;
    fetchedAt: Date;
    processedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

// =============================================================================
// SCHEMA DEFINITIONS
// =============================================================================

const SentimentSchema = new Schema<ISentimentAnalysis>({
    label: {
        type: String,
        enum: ['positive', 'neutral', 'negative'],
        required: true
    },
    score: {
        type: Number,
        min: -1,
        max: 1,
        required: true
    }
}, { _id: false });

const EntitySchema = new Schema<IEntity>({
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['company', 'person', 'location', 'product'],
        required: true
    },
    role: String
}, { _id: false });

const AnalysisSchema = new Schema<IAnalysis>({
    sentiment: {
        type: SentimentSchema,
        required: true
    },
    relevanceScore: {
        type: Number,
        min: 0,
        max: 100,
        required: true
    },
    entities: [EntitySchema],
    keywords: [String],
    topics: [String]
}, { _id: false });

const InteractionSchema = new Schema<IInteraction>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    action: {
        type: String,
        enum: ['viewed', 'shared', 'dismissed', 'opportunity_created'],
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    opportunityId: {
        type: Schema.Types.ObjectId,
        ref: 'Opportunity'
    },
    metadata: Schema.Types.Mixed
}, { _id: false });

const NewsAlertSchema = new Schema<INewsAlert>({
    accountId: {
        type: Schema.Types.ObjectId,
        ref: 'Account',
        required: true,
        index: true
    },

    // Article Details
    title: {
        type: String,
        required: true,
        maxlength: 500
    },
    summary: {
        type: String,
        required: true,
        maxlength: 2000
    },
    content: {
        type: String,
        maxlength: 50000
    },
    sourceUrl: {
        type: String,
        required: true
    },
    sourceName: {
        type: String,
        required: true
    },
    sourceType: {
        type: String,
        enum: ['news', 'press_release', 'blog', 'social'],
        default: 'news'
    },
    publishedAt: {
        type: Date,
        required: true,
        index: true
    },

    // Media
    imageUrl: String,
    thumbnailUrl: String,

    // Classification
    category: {
        type: String,
        enum: ['earnings', 'product_launch', 'ma', 'leadership', 'regulatory', 'market'],
        required: true,
        index: true
    },
    subcategory: String,
    tags: [{
        type: String,
        trim: true
    }],

    // AI Analysis
    analysis: {
        type: AnalysisSchema,
        required: true
    },

    // User Interactions
    interactions: [InteractionSchema],

    // Status
    isActive: {
        type: Boolean,
        default: true,
        index: true
    },
    isRead: {
        type: Boolean,
        default: false
    },
    isDismissed: {
        type: Boolean,
        default: false
    },

    // Metadata
    expiresAt: {
        type: Date,
        required: true,
        index: true
    },
    fetchedAt: {
        type: Date,
        required: true
    },
    processedAt: Date
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// =============================================================================
// INDEXES
// =============================================================================

NewsAlertSchema.index({ accountId: 1, publishedAt: -1 });
NewsAlertSchema.index({ category: 1, publishedAt: -1 });
NewsAlertSchema.index({ 'analysis.relevanceScore': -1 });
NewsAlertSchema.index({ tags: 1 });
NewsAlertSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // TTL index
NewsAlertSchema.index({ sourceUrl: 1 }, { unique: true });

// Text search index
NewsAlertSchema.index({
    title: 'text',
    summary: 'text',
    content: 'text'
});

// =============================================================================
// VIRTUALS
// =============================================================================

NewsAlertSchema.virtual('account', {
    ref: 'Account',
    localField: 'accountId',
    foreignField: '_id',
    justOne: true
});

NewsAlertSchema.virtual('sentimentLabel').get(function () {
    return this.analysis?.sentiment?.label;
});

NewsAlertSchema.virtual('relevance').get(function () {
    return this.analysis?.relevanceScore;
});

NewsAlertSchema.virtual('viewCount').get(function () {
    return this.interactions?.filter((i: IInteraction) => i.action === 'viewed').length || 0;
});

NewsAlertSchema.virtual('isStale').get(function () {
    const now = new Date();
    const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    return this.publishedAt < dayAgo;
});

// =============================================================================
// INSTANCE METHODS
// =============================================================================

NewsAlertSchema.methods.markAsRead = function (userId: Types.ObjectId) {
    this.isRead = true;
    const alreadyViewed = this.interactions.some(
        (i: IInteraction) => i.userId.toString() === userId.toString() && i.action === 'viewed'
    );
    if (!alreadyViewed) {
        this.interactions.push({
            userId,
            action: 'viewed',
            timestamp: new Date()
        });
    }
    return this.save();
};

NewsAlertSchema.methods.dismiss = function (userId: Types.ObjectId) {
    this.isDismissed = true;
    this.interactions.push({
        userId,
        action: 'dismissed',
        timestamp: new Date()
    });
    return this.save();
};

NewsAlertSchema.methods.share = function (userId: Types.ObjectId) {
    this.interactions.push({
        userId,
        action: 'shared',
        timestamp: new Date()
    });
    return this.save();
};

NewsAlertSchema.methods.createOpportunity = function (userId: Types.ObjectId, opportunityId: Types.ObjectId) {
    this.interactions.push({
        userId,
        action: 'opportunity_created',
        timestamp: new Date(),
        opportunityId
    });
    return this.save();
};

// =============================================================================
// STATIC METHODS
// =============================================================================

NewsAlertSchema.statics.findByAccount = function (accountId: Types.ObjectId, options: {
    category?: NewsCategory;
    sentiment?: SentimentLabel;
    limit?: number;
    skip?: number;
} = {}) {
    const query: Record<string, unknown> = {
        accountId,
        isActive: true,
        isDismissed: false
    };

    if (options.category) {
        query.category = options.category;
    }

    if (options.sentiment) {
        query['analysis.sentiment.label'] = options.sentiment;
    }

    return this.find(query)
        .sort({ publishedAt: -1, 'analysis.relevanceScore': -1 })
        .limit(options.limit || 50)
        .skip(options.skip || 0);
};

NewsAlertSchema.statics.findTopAlerts = function (accountId: Types.ObjectId, limit: number = 10) {
    return this.find({
        accountId,
        isActive: true,
        isDismissed: false,
        'analysis.relevanceScore': { $gte: 70 }
    })
        .sort({ 'analysis.relevanceScore': -1, publishedAt: -1 })
        .limit(limit);
};

NewsAlertSchema.statics.findByCategory = function (category: NewsCategory, options = {}) {
    return this.find({
        category,
        isActive: true,
        ...options
    }).sort({ publishedAt: -1 });
};

NewsAlertSchema.statics.getUnreadCount = function (accountId: Types.ObjectId) {
    return this.countDocuments({
        accountId,
        isActive: true,
        isRead: false,
        isDismissed: false
    });
};

NewsAlertSchema.statics.findDuplicates = function (title: string, sourceUrl: string) {
    return this.findOne({
        $or: [
            { sourceUrl },
            { title: { $regex: new RegExp(title.substring(0, 50), 'i') } }
        ]
    });
};

// =============================================================================
// MIDDLEWARE
// =============================================================================

// Set expiration date (30 days from now)
NewsAlertSchema.pre('save', function (next) {
    if (this.isNew && !this.expiresAt) {
        const thirtyDaysFromNow = new Date();
        thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
        this.expiresAt = thirtyDaysFromNow;
    }
    next();
});

// Set processed timestamp
NewsAlertSchema.pre('save', function (next) {
    if (this.isNew && this.analysis && !this.processedAt) {
        this.processedAt = new Date();
    }
    next();
});

// =============================================================================
// EXPORT
// =============================================================================

export const NewsAlert = mongoose.model<INewsAlert>('NewsAlert', NewsAlertSchema);
export default NewsAlert;
