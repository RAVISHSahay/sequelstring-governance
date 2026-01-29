// Occasion-Based Auto Email Types

export type OccasionType = 'Birthday' | 'Anniversary' | 'Custom';

export interface ContactImportantDate {
    id: string;
    contactId: string;
    type: OccasionType;
    customLabel?: string; // Only for 'Custom' type
    date: string; // DD-MM-YYYY or DD-MM
    repeatAnnually: boolean;
    emailTemplateId: string;
    sendTime: string; // HH:MM format (24-hour)
    senderUserId?: string; // Defaults to account owner
    optOutGreeting: boolean;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface EmailTemplate {
    id: string;
    name: string;
    subject: string;
    body: string; // HTML/Rich text
    occasionType: OccasionType | 'Any';
    isActive: boolean;
    tokens: string[]; // Supported personalization tokens
    createdBy: string;
    createdAt: string;
    updatedAt: string;
}

export interface EmailLog {
    id: string;
    contactId: string;
    templateId: string;
    importantDateId: string;
    occasionDate: string;
    subject: string;
    body: string;
    status: 'Queued' | 'Sent' | 'Failed' | 'Bounced';
    sentAt?: string;
    error?: string;
    retryCount: number;
    recipientEmail: string;
    senderEmail: string;
    createdAt: string;
}

export interface PersonalizationTokens {
    first_name: string;
    last_name: string;
    company_name: string;
    designation: string;
    occasion_label: string;
    sender_name: string;
    sender_email: string;
    [key: string]: string;
}

export const DEFAULT_TEMPLATES = {
    BIRTHDAY_CORPORATE: {
        subject: "Happy Birthday, {{first_name}}! 🎉",
        body: `Hello {{first_name}},

Wishing you a very Happy Birthday. 🎂
May the year ahead bring you good health, happiness, and success.

Warm regards,
{{sender_name}}
{{company_name}}`
    },
    BIRTHDAY_FRIENDLY: {
        subject: "Many Happy Returns, {{first_name}}!",
        body: `Hi {{first_name}},

Happy Birthday! 🎉
Hope you have a wonderful day and a fantastic year ahead.

Best wishes,
{{sender_name}}`
    },
    ANNIVERSARY_CORPORATE: {
        subject: "Happy Anniversary, {{first_name}} 💐",
        body: `Hello {{first_name}},

Warm wishes on your anniversary. 💐
May your day be filled with joy and wonderful moments.

Regards,
{{sender_name}}
{{company_name}}`
    },
    CUSTOM_OCCASION: {
        subject: "Congratulations on your {{occasion_label}}, {{first_name}}!",
        body: `Hi {{first_name}},

Congratulations on your {{occasion_label}}. 🎊
Wishing you continued success and many more milestones ahead.

Best regards,
{{sender_name}}
{{company_name}}`
    }
};
