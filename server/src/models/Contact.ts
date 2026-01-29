// server/src/models/Contact.ts
// MongoDB Contact Model with Mongoose

import mongoose, { Document, Schema, Types } from 'mongoose';

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

export interface IImportantDate {
    _id?: Types.ObjectId;
    type: 'birthday' | 'anniversary' | 'work_anniversary' | 'custom';
    label?: string;
    date: string; // DD-MM format
    year?: number;
    sendTime: string; // HH:MM format
    timezone: string;
    emailTemplateId: Types.ObjectId;
    repeatAnnually: boolean;
    optOut: boolean;
    isActive: boolean;
    lastSentAt?: Date;
    nextSendAt?: Date;
    createdAt: Date;
    updatedAt?: Date;
}

export interface ISocialProfile {
    _id?: Types.ObjectId;
    platform: 'linkedin' | 'twitter' | 'facebook';
    profileUrl: string;
    profileId: string;
    displayName: string;
    headline?: string;
    avatarUrl?: string;
    followers?: number;
    connections?: number;
    isVerified: boolean;
    accessToken?: string; // Encrypted
    refreshToken?: string; // Encrypted
    tokenExpiresAt?: Date;
    lastSyncedAt?: Date;
    syncStatus: 'success' | 'failed' | 'pending';
    createdAt: Date;
}

export interface IContact extends Document {
    _id: Types.ObjectId;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    title?: string;
    accountId?: Types.ObjectId;
    ownerId: Types.ObjectId;
    importantDates: IImportantDate[];
    socialProfiles: ISocialProfile[];
    source: 'manual' | 'import' | 'api';
    tags: string[];
    customFields: Record<string, unknown>;
    createdAt: Date;
    updatedAt: Date;
    createdBy: Types.ObjectId;
    updatedBy?: Types.ObjectId;

    // Virtual methods
    fullName: string;
    upcomingDates(): IImportantDate[];
}

// =============================================================================
// SCHEMA DEFINITIONS
// =============================================================================

const ImportantDateSchema = new Schema<IImportantDate>({
    type: {
        type: String,
        enum: ['birthday', 'anniversary', 'work_anniversary', 'custom'],
        required: true
    },
    label: String,
    date: {
        type: String,
        required: true,
        validate: {
            validator: (v: string) => /^\d{2}-\d{2}$/.test(v),
            message: 'Date must be in DD-MM format'
        }
    },
    year: Number,
    sendTime: {
        type: String,
        required: true,
        default: '09:00'
    },
    timezone: {
        type: String,
        required: true,
        default: 'UTC'
    },
    emailTemplateId: {
        type: Schema.Types.ObjectId,
        ref: 'EmailTemplate',
        required: true
    },
    repeatAnnually: {
        type: Boolean,
        default: true
    },
    optOut: {
        type: Boolean,
        default: false
    },
    isActive: {
        type: Boolean,
        default: true
    },
    lastSentAt: Date,
    nextSendAt: Date,
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: Date
});

const SocialProfileSchema = new Schema<ISocialProfile>({
    platform: {
        type: String,
        enum: ['linkedin', 'twitter', 'facebook'],
        required: true
    },
    profileUrl: {
        type: String,
        required: true
    },
    profileId: {
        type: String,
        required: true
    },
    displayName: {
        type: String,
        required: true
    },
    headline: String,
    avatarUrl: String,
    followers: Number,
    connections: Number,
    isVerified: {
        type: Boolean,
        default: false
    },
    accessToken: String, // Should be encrypted
    refreshToken: String, // Should be encrypted
    tokenExpiresAt: Date,
    lastSyncedAt: Date,
    syncStatus: {
        type: String,
        enum: ['success', 'failed', 'pending'],
        default: 'pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const ContactSchema = new Schema<IContact>({
    firstName: {
        type: String,
        required: [true, 'First name is required'],
        trim: true,
        maxlength: 100
    },
    lastName: {
        type: String,
        required: [true, 'Last name is required'],
        trim: true,
        maxlength: 100
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        validate: {
            validator: (v: string) => /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v),
            message: 'Please enter a valid email address'
        }
    },
    phone: {
        type: String,
        trim: true
    },
    title: {
        type: String,
        trim: true,
        maxlength: 200
    },
    accountId: {
        type: Schema.Types.ObjectId,
        ref: 'Account',
        index: true
    },
    ownerId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    importantDates: [ImportantDateSchema],
    socialProfiles: [SocialProfileSchema],
    source: {
        type: String,
        enum: ['manual', 'import', 'api'],
        default: 'manual'
    },
    tags: [{
        type: String,
        trim: true
    }],
    customFields: {
        type: Schema.Types.Mixed,
        default: {}
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    updatedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// =============================================================================
// INDEXES
// =============================================================================

ContactSchema.index({ email: 1 }, { unique: true });
ContactSchema.index({ accountId: 1 });
ContactSchema.index({ ownerId: 1 });
ContactSchema.index({ 'importantDates.date': 1 });
ContactSchema.index({ 'importantDates.nextSendAt': 1 });
ContactSchema.index({ 'socialProfiles.platform': 1 });
ContactSchema.index({ 'socialProfiles.profileId': 1 });
ContactSchema.index({ tags: 1 });
ContactSchema.index({ createdAt: -1 });

// Text search index
ContactSchema.index({
    firstName: 'text',
    lastName: 'text',
    email: 'text'
});

// =============================================================================
// VIRTUALS
// =============================================================================

ContactSchema.virtual('fullName').get(function () {
    return `${this.firstName} ${this.lastName}`;
});

ContactSchema.virtual('account', {
    ref: 'Account',
    localField: 'accountId',
    foreignField: '_id',
    justOne: true
});

// =============================================================================
// INSTANCE METHODS
// =============================================================================

ContactSchema.methods.upcomingDates = function (days: number = 30): IImportantDate[] {
    const today = new Date();
    const futureDate = new Date(today.getTime() + days * 24 * 60 * 60 * 1000);

    return this.importantDates.filter((date: IImportantDate) => {
        if (!date.isActive || date.optOut || !date.nextSendAt) return false;
        return date.nextSendAt >= today && date.nextSendAt <= futureDate;
    });
};

// =============================================================================
// STATIC METHODS
// =============================================================================

ContactSchema.statics.findByEmail = function (email: string) {
    return this.findOne({ email: email.toLowerCase() });
};

ContactSchema.statics.findByOwner = function (ownerId: Types.ObjectId, options = {}) {
    return this.find({ ownerId, ...options });
};

ContactSchema.statics.findWithUpcomingDates = function (days: number = 7) {
    const today = new Date();
    const futureDate = new Date(today.getTime() + days * 24 * 60 * 60 * 1000);

    return this.find({
        'importantDates.isActive': true,
        'importantDates.optOut': { $ne: true },
        'importantDates.nextSendAt': {
            $gte: today,
            $lte: futureDate
        }
    });
};

// =============================================================================
// MIDDLEWARE
// =============================================================================

// Pre-save: Calculate next send dates
ContactSchema.pre('save', function (next) {
    if (this.isModified('importantDates')) {
        this.importantDates.forEach((date) => {
            if (date.isActive && !date.optOut) {
                date.nextSendAt = calculateNextSendDate(date.date, date.sendTime, date.timezone);
            }
        });
    }
    next();
});

// Pre-save: Update timestamps
ContactSchema.pre('save', function (next) {
    if (this.isModified('importantDates')) {
        const now = new Date();
        this.importantDates.forEach((date) => {
            if (date.isNew) {
                date.createdAt = now;
            }
            date.updatedAt = now;
        });
    }
    next();
});

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

function calculateNextSendDate(date: string, time: string, timezone: string): Date {
    const [day, month] = date.split('-').map(Number);
    const [hours, minutes] = time.split(':').map(Number);

    const now = new Date();
    const currentYear = now.getFullYear();

    // Try this year first
    let nextDate = new Date(currentYear, month - 1, day, hours, minutes);

    // If the date has passed this year, use next year
    if (nextDate < now) {
        nextDate = new Date(currentYear + 1, month - 1, day, hours, minutes);
    }

    return nextDate;
}

// =============================================================================
// EXPORT
// =============================================================================

export const Contact = mongoose.model<IContact>('Contact', ContactSchema);
export default Contact;
