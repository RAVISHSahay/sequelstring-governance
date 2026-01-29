import { ContactImportantDate, EmailTemplate, EmailLog, DEFAULT_TEMPLATES } from '@/types/occasionEmail';

// Mock Important Dates Storage
const STORAGE_KEY_DATES = 'crm_important_dates';
const STORAGE_KEY_TEMPLATES = 'crm_email_templates';
const STORAGE_KEY_LOGS = 'crm_email_logs';

// Helper to generate unique IDs
const generateId = () => `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

// Initialize default email templates
export const defaultEmailTemplates: EmailTemplate[] = [
    {
        id: 'tpl_birthday_corporate',
        name: 'Birthday - Corporate',
        subject: DEFAULT_TEMPLATES.BIRTHDAY_CORPORATE.subject,
        body: DEFAULT_TEMPLATES.BIRTHDAY_CORPORATE.body,
        occasionType: 'Birthday',
        isActive: true,
        tokens: ['first_name', 'last_name', 'company_name', 'sender_name'],
        createdBy: 'system',
        createdAt: new Date('2026-01-15').toISOString(),
        updatedAt: new Date('2026-01-15').toISOString(),
    },
    {
        id: 'tpl_birthday_friendly',
        name: 'Birthday - Friendly',
        subject: DEFAULT_TEMPLATES.BIRTHDAY_FRIENDLY.subject,
        body: DEFAULT_TEMPLATES.BIRTHDAY_FRIENDLY.body,
        occasionType: 'Birthday',
        isActive: true,
        tokens: ['first_name', 'sender_name'],
        createdBy: 'system',
        createdAt: new Date('2026-01-15').toISOString(),
        updatedAt: new Date('2026-01-15').toISOString(),
    },
    {
        id: 'tpl_anniversary_corporate',
        name: 'Anniversary - Corporate',
        subject: DEFAULT_TEMPLATES.ANNIVERSARY_CORPORATE.subject,
        body: DEFAULT_TEMPLATES.ANNIVERSARY_CORPORATE.body,
        occasionType: 'Anniversary',
        isActive: true,
        tokens: ['first_name', 'sender_name', 'company_name'],
        createdBy: 'system',
        createdAt: new Date('2026-01-15').toISOString(),
        updatedAt: new Date('2026-01-15').toISOString(),
    },
    {
        id: 'tpl_custom_occasion',
        name: 'Custom Occasion',
        subject: DEFAULT_TEMPLATES.CUSTOM_OCCASION.subject,
        body: DEFAULT_TEMPLATES.CUSTOM_OCCASION.body,
        occasionType: 'Custom',
        isActive: true,
        tokens: ['first_name', 'occasion_label', 'sender_name', 'company_name'],
        createdBy: 'system',
        createdAt: new Date('2026-01-15').toISOString(),
        updatedAt: new Date('2026-01-15').toISOString(),
    },
];

// Mock important dates data
export const mockImportantDates: ContactImportantDate[] = [
    {
        id: 'date_1',
        contactId: '1', // Arun Patel
        type: 'Birthday',
        date: '15-03', // March 15
        repeatAnnually: true,
        emailTemplateId: 'tpl_birthday_friendly',
        sendTime: '09:30',
        optOutGreeting: false,
        isActive: true,
        createdAt: new Date('2026-01-10').toISOString(),
        updatedAt: new Date('2026-01-10').toISOString(),
    },
    {
        id: 'date_2',
        contactId: '2', // Sneha Reddy
        type: 'Birthday',
        date: '22-07-1988', // July 22, 1988
        repeatAnnually: true,
        emailTemplateId: 'tpl_birthday_corporate',
        sendTime: '10:00',
        optOutGreeting: false,
        isActive: true,
        createdAt: new Date('2026-01-12').toISOString(),
        updatedAt: new Date('2026-01-12').toISOString(),
    },
    {
        id: 'date_3',
        contactId: '3', // Vikram Kumar
        type: 'Anniversary',
        date: '14-02', // February 14
        repeatAnnually: true,
        emailTemplateId: 'tpl_anniversary_corporate',
        sendTime: '09:00',
        optOutGreeting: false,
        isActive: true,
        createdAt: new Date('2026-01-15').toISOString(),
        updatedAt: new Date('2026-01-15').toISOString(),
    },
    {
        id: 'date_4',
        contactId: '1', // Arun Patel - Work Anniversary
        type: 'Custom',
        customLabel: 'Work Anniversary',
        date: '01-04', // April 1
        repeatAnnually: true,
        emailTemplateId: 'tpl_custom_occasion',
        sendTime: '09:30',
        optOutGreeting: false,
        isActive: true,
        createdAt: new Date('2026-01-20').toISOString(),
        updatedAt: new Date('2026-01-20').toISOString(),
    },
];

// CRUD Operations for Important Dates
export const getImportantDates = (): ContactImportantDate[] => {
    const stored = localStorage.getItem(STORAGE_KEY_DATES);
    if (stored) {
        return JSON.parse(stored);
    }
    // Initialize with mock data
    localStorage.setItem(STORAGE_KEY_DATES, JSON.stringify(mockImportantDates));
    return mockImportantDates;
};

export const getImportantDatesByContactId = (contactId: string): ContactImportantDate[] => {
    const allDates = getImportantDates();
    return allDates.filter(date => date.contactId === contactId);
};

export const addImportantDate = (date: Omit<ContactImportantDate, 'id' | 'createdAt' | 'updatedAt'>): ContactImportantDate => {
    const allDates = getImportantDates();
    const newDate: ContactImportantDate = {
        ...date,
        id: generateId(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
    allDates.push(newDate);
    localStorage.setItem(STORAGE_KEY_DATES, JSON.stringify(allDates));
    return newDate;
};

export const updateImportantDate = (id: string, updates: Partial<ContactImportantDate>): ContactImportantDate | null => {
    const allDates = getImportantDates();
    const index = allDates.findIndex(d => d.id === id);
    if (index === -1) return null;

    allDates[index] = {
        ...allDates[index],
        ...updates,
        updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY_DATES, JSON.stringify(allDates));
    return allDates[index];
};

export const deleteImportantDate = (id: string): boolean => {
    const allDates = getImportantDates();
    const filtered = allDates.filter(d => d.id !== id);
    if (filtered.length === allDates.length) return false;

    localStorage.setItem(STORAGE_KEY_DATES, JSON.stringify(filtered));
    return true;
};

// CRUD Operations for Email Templates
export const getEmailTemplates = (): EmailTemplate[] => {
    const stored = localStorage.getItem(STORAGE_KEY_TEMPLATES);
    if (stored) {
        return JSON.parse(stored);
    }
    // Initialize with default templates
    localStorage.setItem(STORAGE_KEY_TEMPLATES, JSON.stringify(defaultEmailTemplates));
    return defaultEmailTemplates;
};

export const getActiveEmailTemplates = (): EmailTemplate[] => {
    return getEmailTemplates().filter(t => t.isActive);
};

export const getTemplateById = (id: string): EmailTemplate | null => {
    const templates = getEmailTemplates();
    return templates.find(t => t.id === id) || null;
};

// CRUD Operations for Email Logs
export const getEmailLogs = (): EmailLog[] => {
    const stored = localStorage.getItem(STORAGE_KEY_LOGS);
    return stored ? JSON.parse(stored) : [];
};

export const getEmailLogsByContactId = (contactId: string): EmailLog[] => {
    const allLogs = getEmailLogs();
    return allLogs.filter(log => log.contactId === contactId);
};

export const addEmailLog = (log: Omit<EmailLog, 'id' | 'createdAt'>): EmailLog => {
    const allLogs = getEmailLogs();
    const newLog: EmailLog = {
        ...log,
        id: generateId(),
        createdAt: new Date().toISOString(),
    };
    allLogs.push(newLog);
    localStorage.setItem(STORAGE_KEY_LOGS, JSON.stringify(allLogs));
    return newLog;
};

// Check if email was already sent this year for a specific occasion
export const wasEmailSentThisYear = (contactId: string, importantDateId: string): boolean => {
    const logs = getEmailLogs();
    const currentYear = new Date().getFullYear();

    return logs.some(log =>
        log.contactId === contactId &&
        log.importantDateId === importantDateId &&
        log.status === 'Sent' &&
        new Date(log.occasionDate).getFullYear() === currentYear
    );
};
