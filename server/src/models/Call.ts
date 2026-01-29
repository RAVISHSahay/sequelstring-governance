// server/src/models/Call.ts
// MongoDB Call Model with AI Summary support

import mongoose, { Document, Schema, Types } from 'mongoose';

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

export interface ITranscriptSegment {
    speaker: 'agent' | 'contact';
    speakerId?: Types.ObjectId;
    speakerName?: string;
    text: string;
    startTime: number;
    endTime: number;
    confidence: number;
}

export interface ITranscript {
    status: 'pending' | 'processing' | 'completed' | 'failed';
    language: string;
    text?: string;
    segments: ITranscriptSegment[];
    confidence?: number;
    wordCount?: number;
    processedAt?: Date;
    processingTime?: number; // seconds
    error?: string;
}

export interface IActionItem {
    _id?: Types.ObjectId;
    description: string;
    assigneeId?: Types.ObjectId;
    dueDate?: Date;
    priority: 'low' | 'medium' | 'high';
    status: 'pending' | 'completed' | 'cancelled';
    completedAt?: Date;
    createdAt: Date;
}

export interface ISentiment {
    overall: 'positive' | 'neutral' | 'negative';
    score: number;
    breakdown: {
        positive: number;
        neutral: number;
        negative: number;
    };
    highlights?: {
        positive: string[];
        concerns: string[];
    };
}

export interface IOpportunitySuggestion {
    type: 'upsell' | 'cross-sell' | 'renewal' | 'new';
    description: string;
    estimatedValue?: number;
    probability?: number;
    suggestedAction: string;
}

export interface IAISummary {
    status: 'pending' | 'processing' | 'completed' | 'failed';
    model: string;
    summary?: string;
    keyPoints: string[];
    actionItems: IActionItem[];
    sentiment?: ISentiment;
    topics: string[];
    nextSteps?: string;
    opportunities: IOpportunitySuggestion[];
    generatedAt?: Date;
    processingTime?: number; // seconds
    error?: string;
}

export interface IRecording {
    url: string;
    duration: number; // seconds
    size: number; // bytes
    format: 'mp3' | 'wav' | 'm4a';
    status: 'processing' | 'available' | 'deleted';
    uploadedAt?: Date;
}

export interface ICall extends Document {
    _id: Types.ObjectId;
    contactId: Types.ObjectId;
    accountId?: Types.ObjectId;
    userId: Types.ObjectId;

    // Call Details
    type: 'inbound' | 'outbound' | 'scheduled';
    status: 'scheduled' | 'in-progress' | 'completed' | 'missed' | 'cancelled';
    direction?: 'inbound' | 'outbound';

    // Timing
    scheduledAt?: Date;
    startedAt?: Date;
    endedAt?: Date;
    duration?: number; // seconds

    // CTI Integration
    ctiProvider?: 'twilio' | 'ringcentral' | 'zoom' | 'teams';
    externalCallId?: string;
    dialedNumber?: string;
    callerNumber?: string;

    // Recording & Transcript
    recording?: IRecording;
    transcript?: ITranscript;
    aiSummary?: IAISummary;

    // User Data
    notes?: string;
    tags: string[];

    // Metadata
    createdAt: Date;
    updatedAt: Date;
    createdBy: Types.ObjectId;
}

// =============================================================================
// SCHEMA DEFINITIONS
// =============================================================================

const TranscriptSegmentSchema = new Schema<ITranscriptSegment>({
    speaker: {
        type: String,
        enum: ['agent', 'contact'],
        required: true
    },
    speakerId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    speakerName: String,
    text: {
        type: String,
        required: true
    },
    startTime: {
        type: Number,
        required: true
    },
    endTime: {
        type: Number,
        required: true
    },
    confidence: {
        type: Number,
        min: 0,
        max: 1,
        default: 0
    }
}, { _id: false });

const TranscriptSchema = new Schema<ITranscript>({
    status: {
        type: String,
        enum: ['pending', 'processing', 'completed', 'failed'],
        default: 'pending'
    },
    language: {
        type: String,
        default: 'en-US'
    },
    text: String,
    segments: [TranscriptSegmentSchema],
    confidence: {
        type: Number,
        min: 0,
        max: 1
    },
    wordCount: Number,
    processedAt: Date,
    processingTime: Number,
    error: String
}, { _id: false });

const ActionItemSchema = new Schema<IActionItem>({
    description: {
        type: String,
        required: true,
        maxlength: 500
    },
    assigneeId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    dueDate: Date,
    priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium'
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'cancelled'],
        default: 'pending'
    },
    completedAt: Date,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const SentimentSchema = new Schema<ISentiment>({
    overall: {
        type: String,
        enum: ['positive', 'neutral', 'negative'],
        required: true
    },
    score: {
        type: Number,
        min: -1,
        max: 1,
        required: true
    },
    breakdown: {
        positive: { type: Number, min: 0, max: 1 },
        neutral: { type: Number, min: 0, max: 1 },
        negative: { type: Number, min: 0, max: 1 }
    },
    highlights: {
        positive: [String],
        concerns: [String]
    }
}, { _id: false });

const OpportunitySchema = new Schema<IOpportunitySuggestion>({
    type: {
        type: String,
        enum: ['upsell', 'cross-sell', 'renewal', 'new'],
        required: true
    },
    description: {
        type: String,
        required: true,
        maxlength: 500
    },
    estimatedValue: Number,
    probability: {
        type: Number,
        min: 0,
        max: 1
    },
    suggestedAction: String
}, { _id: false });

const AISummarySchema = new Schema<IAISummary>({
    status: {
        type: String,
        enum: ['pending', 'processing', 'completed', 'failed'],
        default: 'pending'
    },
    model: {
        type: String,
        default: 'gpt-4-turbo'
    },
    summary: String,
    keyPoints: [String],
    actionItems: [ActionItemSchema],
    sentiment: SentimentSchema,
    topics: [String],
    nextSteps: String,
    opportunities: [OpportunitySchema],
    generatedAt: Date,
    processingTime: Number,
    error: String
}, { _id: false });

const RecordingSchema = new Schema<IRecording>({
    url: {
        type: String,
        required: true
    },
    duration: {
        type: Number,
        required: true
    },
    size: Number,
    format: {
        type: String,
        enum: ['mp3', 'wav', 'm4a'],
        default: 'mp3'
    },
    status: {
        type: String,
        enum: ['processing', 'available', 'deleted'],
        default: 'processing'
    },
    uploadedAt: Date
}, { _id: false });

const CallSchema = new Schema<ICall>({
    contactId: {
        type: Schema.Types.ObjectId,
        ref: 'Contact',
        required: true,
        index: true
    },
    accountId: {
        type: Schema.Types.ObjectId,
        ref: 'Account',
        index: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },

    // Call Details
    type: {
        type: String,
        enum: ['inbound', 'outbound', 'scheduled'],
        required: true
    },
    status: {
        type: String,
        enum: ['scheduled', 'in-progress', 'completed', 'missed', 'cancelled'],
        default: 'scheduled',
        index: true
    },
    direction: {
        type: String,
        enum: ['inbound', 'outbound']
    },

    // Timing
    scheduledAt: {
        type: Date,
        index: true
    },
    startedAt: Date,
    endedAt: Date,
    duration: Number,

    // CTI Integration
    ctiProvider: {
        type: String,
        enum: ['twilio', 'ringcentral', 'zoom', 'teams']
    },
    externalCallId: {
        type: String,
        index: true
    },
    dialedNumber: String,
    callerNumber: String,

    // Recording & Transcript
    recording: RecordingSchema,
    transcript: TranscriptSchema,
    aiSummary: AISummarySchema,

    // User Data
    notes: {
        type: String,
        maxlength: 5000
    },
    tags: [{
        type: String,
        trim: true
    }],

    // Metadata
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// =============================================================================
// INDEXES
// =============================================================================

CallSchema.index({ contactId: 1, startedAt: -1 });
CallSchema.index({ userId: 1, status: 1 });
CallSchema.index({ 'transcript.status': 1 });
CallSchema.index({ 'aiSummary.status': 1 });
CallSchema.index({ tags: 1 });
CallSchema.index({ createdAt: -1 });

// =============================================================================
// VIRTUALS
// =============================================================================

CallSchema.virtual('contact', {
    ref: 'Contact',
    localField: 'contactId',
    foreignField: '_id',
    justOne: true
});

CallSchema.virtual('account', {
    ref: 'Account',
    localField: 'accountId',
    foreignField: '_id',
    justOne: true
});

CallSchema.virtual('user', {
    ref: 'User',
    localField: 'userId',
    foreignField: '_id',
    justOne: true
});

CallSchema.virtual('hasRecording').get(function () {
    return this.recording?.status === 'available';
});

CallSchema.virtual('hasTranscript').get(function () {
    return this.transcript?.status === 'completed';
});

CallSchema.virtual('hasAISummary').get(function () {
    return this.aiSummary?.status === 'completed';
});

CallSchema.virtual('durationFormatted').get(function () {
    if (!this.duration) return null;
    const mins = Math.floor(this.duration / 60);
    const secs = this.duration % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
});

// =============================================================================
// INSTANCE METHODS
// =============================================================================

CallSchema.methods.startCall = function () {
    this.status = 'in-progress';
    this.startedAt = new Date();
    return this.save();
};

CallSchema.methods.endCall = function () {
    this.status = 'completed';
    this.endedAt = new Date();
    if (this.startedAt) {
        this.duration = Math.floor((this.endedAt.getTime() - this.startedAt.getTime()) / 1000);
    }
    return this.save();
};

CallSchema.methods.addActionItem = function (actionItem: Partial<IActionItem>) {
    if (!this.aiSummary) {
        this.aiSummary = { status: 'pending', keyPoints: [], actionItems: [], topics: [], opportunities: [], model: 'manual' };
    }
    this.aiSummary.actionItems.push({
        description: actionItem.description || '',
        assigneeId: actionItem.assigneeId,
        dueDate: actionItem.dueDate,
        priority: actionItem.priority || 'medium',
        status: 'pending',
        createdAt: new Date()
    });
    return this.save();
};

CallSchema.methods.completeActionItem = function (actionItemId: Types.ObjectId) {
    if (!this.aiSummary?.actionItems) return this;

    const item = this.aiSummary.actionItems.find(
        (ai: IActionItem) => ai._id?.toString() === actionItemId.toString()
    );
    if (item) {
        item.status = 'completed';
        item.completedAt = new Date();
    }
    return this.save();
};

// =============================================================================
// STATIC METHODS
// =============================================================================

CallSchema.statics.findByContact = function (contactId: Types.ObjectId, options = {}) {
    return this.find({ contactId, ...options }).sort({ startedAt: -1 });
};

CallSchema.statics.findUpcoming = function (userId: Types.ObjectId, days: number = 7) {
    const now = new Date();
    const future = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

    return this.find({
        userId,
        status: 'scheduled',
        scheduledAt: { $gte: now, $lte: future }
    }).sort({ scheduledAt: 1 });
};

CallSchema.statics.findPendingTranscription = function () {
    return this.find({
        'recording.status': 'available',
        $or: [
            { 'transcript.status': 'pending' },
            { transcript: { $exists: false } }
        ]
    });
};

CallSchema.statics.findPendingAISummary = function () {
    return this.find({
        'transcript.status': 'completed',
        $or: [
            { 'aiSummary.status': 'pending' },
            { aiSummary: { $exists: false } }
        ]
    });
};

// =============================================================================
// MIDDLEWARE
// =============================================================================

// Calculate duration on end
CallSchema.pre('save', function (next) {
    if (this.isModified('endedAt') && this.startedAt && this.endedAt) {
        this.duration = Math.floor((this.endedAt.getTime() - this.startedAt.getTime()) / 1000);
    }
    next();
});

// Set direction based on type
CallSchema.pre('save', function (next) {
    if (this.isNew && !this.direction) {
        this.direction = this.type === 'inbound' ? 'inbound' : 'outbound';
    }
    next();
});

// =============================================================================
// EXPORT
// =============================================================================

export const Call = mongoose.model<ICall>('Call', CallSchema);
export default Call;
