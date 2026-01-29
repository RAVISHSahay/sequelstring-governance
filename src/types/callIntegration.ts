// Outbound Call Integration Types

export type CallDirection = 'inbound' | 'outbound';
export type CallStatus = 'Connected' | 'No Answer' | 'Busy' | 'Failed' | 'Voicemail' | 'Canceled';
export type CallDisposition = 'Interested' | 'Call Back' | 'Not Interested' | 'Wrong Number' | 'Follow-up Required' | 'Meeting Scheduled' | 'Converted' | 'DNC';

export type EntityType = 'lead' | 'contact' | 'prospect' | 'account';
export type CTIProvider = 'Exotel' | 'Knowlarity' | 'Twilio' | 'Aircall' | 'RingCentral' | 'Custom';

export interface CallActivity {
    id: string;

    // Linked entity
    entityType: EntityType;
    entityId: string;
    entityName: string; // Cached for display

    // Call participants
    userId: string; // CRM user (caller)
    userName: string; // Cached

    // Call details
    direction: CallDirection;
    fromNumber: string;
    toNumber: string;
    normalizedToNumber: string; // For matching

    // Timing
    startTime: string;
    endTime?: string;
    duration?: number; // in seconds

    // Status & outcome
    status: CallStatus;
    disposition?: CallDisposition;

    // Content
    notes?: string;
    transcript?: string;
    recordingUrl?: string;
    sentiment?: 'positive' | 'neutral' | 'negative';
    keywords?: string[];

    // Next action
    nextAction?: 'create_task' | 'schedule_meeting' | 'create_opportunity' | 'send_email' | 'mark_dnc' | 'none';
    nextActionDetails?: {
        taskId?: string;
        meetingId?: string;
        opportunityId?: string;
        scheduledFor?: string;
    };

    // Integration metadata
    provider?: CTIProvider;
    providerCallId?: string; // Unique ID from telephony provider
    callEventIds?: string[]; // Related call events

    // Compliance
    recordingConsent: boolean;
    isDNC: boolean;

    // Audit
    createdAt: string;
    updatedAt: string;
    lastEditedBy?: string;
}

export interface CallEvent {
    id: string;
    providerCallId: string;
    eventType: 'call_initiated' | 'ringing' | 'connected' | 'completed' | 'failed' | 'no_answer' | 'busy';
    timestamp: string;
    payloadJson: Record<string, any>;
    processed: boolean;
    callActivityId?: string;
    createdAt: string;
}

export interface DNCEntry {
    id: string;
    phoneNumber: string;
    normalizedPhoneNumber: string;
    entityType?: EntityType;
    entityId?: string;
    reason: string;
    addedBy: string;
    addedAt: string;
    expiresAt?: string;
    isActive: boolean;
}

export interface CallScript {
    id: string;
    name: string;
    description: string;
    script: string; // Rich text
    tags: string[];
    useCase: 'cold_call' | 'follow_up' | 'qualification' | 'objection_handling' | 'closing';
    isActive: boolean;
    createdBy: string;
    createdAt: string;
    updatedAt: string;
}

export interface CTIIntegration {
    id: string;
    provider: CTIProvider;
    isEnabled: boolean;

    // API credentials (stored securely)
    apiKeyRef?: string;
    apiSecretRef?: string;
    accountSid?: string;

    // Webhook config
    webhookUrl?: string;
    webhookSecret?: string;

    // Features
    clickToCallEnabled: boolean;
    autoCallPopEnabled: boolean;
    recordingEnabled: boolean;
    transcriptionEnabled: boolean;
    sentimentAnalysisEnabled: boolean;

    // Settings
    defaultDialingPrefix?: string; // e.g., "+91"
    autoLogCalls: boolean;
    requireDisposition: boolean;
    showDNCWarning: boolean;

    // Rate limits
    callsPerDayPerUser?: number;
    recordingRetentionDays?: number;

    createdAt: string;
    updatedAt: string;
}

export interface CallMetrics {
    userId: string;
    date: string;
    totalCalls: number;
    connectedCalls: number;
    missedCalls: number;
    totalDuration: number; // seconds
    averageDuration: number;
    successRate: number; // percentage
    dispositionBreakdown: Record<CallDisposition, number>;
}

// Call matching logic result
export interface PhoneMatchResult {
    matched: boolean;
    entityType?: EntityType;
    entityId?: string;
    entityName?: string;
    matchType: 'exact' | 'normalized' | 'partial' | 'none';
    multipleMatches: boolean;
    matches?: Array<{
        entityType: EntityType;
        entityId: string;
        entityName: string;
        phoneNumber: string;
    }>;
}

// Click-to-call request
export interface ClickToCallRequest {
    toNumber: string;
    entityType: EntityType;
    entityId: string;
    userId: string;
    notes?: string;
}

// Call pop panel data
export interface CallPopData {
    entityType: EntityType;
    entityId: string;
    entityName: string;
    companyName?: string;
    lastInteraction?: {
        type: string;
        date: string;
        summary: string;
    };
    talkingPoints?: string[];
    suggestedScript?: CallScript;
    isDNC: boolean;
    callHistory: CallActivity[];
}

export const DISPOSITION_NEXT_ACTIONS: Record<CallDisposition, string[]> = {
    'Interested': ['create_task', 'schedule_meeting', 'create_opportunity'],
    'Call Back': ['create_task'],
    'Not Interested': ['mark_dnc'],
    'Wrong Number': [],
    'Follow-up Required': ['create_task', 'send_email'],
    'Meeting Scheduled': ['schedule_meeting'],
    'Converted': ['create_opportunity'],
    'DNC': ['mark_dnc']
};

// Normalize phone number for matching
export function normalizePhoneNumber(phone: string): string {
    // Remove +, spaces, hyphens, parentheses, and leading zeros
    return phone.replace(/[\s\-\(\)\+]/g, '').replace(/^0+/, '');
}
