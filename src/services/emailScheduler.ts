import {
    getImportantDates,
    getTemplateById,
    addEmailLog,
    wasEmailSentThisYear
} from '@/data/importantDates';
import { ContactImportantDate, PersonalizationTokens } from '@/types/occasionEmail';
import { replaceTokens } from './templateEngine';

/**
 * Check if a date matches today (ignoring year for annual events)
 */
export function isDateToday(dateString: string): boolean {
    const today = new Date();
    const todayDay = today.getDate();
    const todayMonth = today.getMonth() + 1; // 0-indexed

    // Parse date (supports DD-MM or DD-MM-YYYY)
    const parts = dateString.split('-');
    if (parts.length < 2) return false;

    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10);

    return day === todayDay && month === todayMonth;
}

/**
 * Handle February 29 birthdays on non-leap years
 * Strategy: Send on Feb 28 if current year is not a leap year
 */
export function shouldSendLeapYearBirthday(dateString: string): boolean {
    const parts = dateString.split('-');
    if (parts.length < 2) return false;

    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10);

    // Check if this is a Feb 29 birthday
    if (month !== 2 || day !== 29) return false;

    const today = new Date();
    const currentYear = today.getFullYear();
    const isLeapYear = (currentYear % 4 === 0 && currentYear % 100 !== 0) || currentYear % 400 === 0;

    // If it's a leap year and today is Feb 29, send it
    if (isLeapYear && today.getMonth() === 1 && today.getDate() === 29) {
        return true;
    }

    // If not a leap year and today is Feb 28, send it
    if (!isLeapYear && today.getMonth() === 1 && today.getDate() === 28) {
        return true;
    }

    return false;
}

/**
 * Get contact details for email personalization
 * In a real app, this would fetch from contacts database
 */
function getContactDetails(contactId: string): {
    firstName: string;
    lastName: string;
    email: string;
    company: string;
    designation: string;
} {
    // Mock contact data - in real app, fetch from contacts table
    const mockContacts: Record<string, any> = {
        '1': { firstName: 'Arun', lastName: 'Patel', email: 'arun.patel@zomato.com', company: 'Zomato', designation: 'VP Engineering' },
        '2': { firstName: 'Sneha', lastName: 'Reddy', email: 'sneha.reddy@swiggy.com', company: 'Swiggy', designation: 'Head of Operations' },
        '3': { firstName: 'Vikram', lastName: 'Kumar', email: 'vikram.kumar@paytm.com', company: 'Paytm', designation: 'Director - Sales' },
    };

    return mockContacts[contactId] || {
        firstName: 'Valued',
        lastName: 'Customer',
        email: 'customer@example.com',
        company: 'Company',
        designation: 'Team Member',
    };
}

/**
 * Get sender details for email personalization
 * In a real app, this would fetch from users database
 */
function getSenderDetails(userId?: string): {
    name: string;
    email: string;
} {
    // Mock sender data - in real app, fetch from users table
    return {
        name: 'Priya Sharma',
        email: 'priya.sharma@company.com',
    };
}

/**
 * Send an occasion email (simulated)
 */
async function sendEmail(
    to: string,
    subject: string,
    body: string
): Promise<{ success: boolean; error?: string }> {
    // Simulate email sending with 95% success rate
    return new Promise((resolve) => {
        setTimeout(() => {
            const success = Math.random() > 0.05; // 95% success rate
            resolve({
                success,
                error: success ? undefined : 'SMTP connection failed',
            });
        }, 500);
    });
}

/**
 * Process a single important date and send email if due
 */
export async function processImportantDate(
    importantDate: ContactImportantDate
): Promise<{
    sent: boolean;
    reason?: string;
    emailLogId?: string;
}> {
    // Check if active
    if (!importantDate.isActive) {
        return { sent: false, reason: 'Date is not active' };
    }

    // Check if opted out
    if (importantDate.optOutGreeting) {
        return { sent: false, reason: 'Contact opted out of greetings' };
    }

    // Check if date matches today
    const isToday = isDateToday(importantDate.date);
    const isLeapYearMatch = shouldSendLeapYearBirthday(importantDate.date);

    if (!isToday && !isLeapYearMatch) {
        return { sent: false, reason: 'Date does not match today' };
    }

    // Check if already sent this year
    if (wasEmailSentThisYear(importantDate.contactId, importantDate.id)) {
        return { sent: false, reason: 'Email already sent this year' };
    }

    // Get template
    const template = getTemplateById(importantDate.emailTemplateId);
    if (!template || !template.isActive) {
        return { sent: false, reason: 'Template not found or inactive' };
    }

    // Get contact and sender details
    const contact = getContactDetails(importantDate.contactId);
    const sender = getSenderDetails(importantDate.senderUserId);

    // Build personalization tokens
    const tokens: PersonalizationTokens = {
        first_name: contact.firstName,
        last_name: contact.lastName,
        company_name: contact.company,
        designation: contact.designation,
        occasion_label: importantDate.customLabel || importantDate.type,
        sender_name: sender.name,
        sender_email: sender.email,
    };

    // Replace tokens
    const subject = replaceTokens(template.subject, tokens);
    const body = replaceTokens(template.body, tokens);

    // Send email
    const result = await sendEmail(contact.email, subject, body);

    // Log the email
    const emailLog = addEmailLog({
        contactId: importantDate.contactId,
        templateId: template.id,
        importantDateId: importantDate.id,
        occasionDate: new Date().toISOString().split('T')[0],
        subject,
        body,
        status: result.success ? 'Sent' : 'Failed',
        sentAt: result.success ? new Date().toISOString() : undefined,
        error: result.error,
        retryCount: 0,
        recipientEmail: contact.email,
        senderEmail: sender.email,
    });

    return {
        sent: result.success,
        reason: result.success ? 'Email sent successfully' : `Failed: ${result.error}`,
        emailLogId: emailLog.id,
    };
}

/**
 * Daily scheduler: Check all important dates and send emails
 * This would be called by a cron job in a real application
 */
export async function runDailyScheduler(): Promise<{
    totalChecked: number;
    emailsSent: number;
    emailsFailed: number;
    results: Array<{
        dateId: string;
        contactId: string;
        sent: boolean;
        reason: string;
    }>;
}> {
    const allDates = getImportantDates();
    const results: Array<{
        dateId: string;
        contactId: string;
        sent: boolean;
        reason: string;
    }> = [];

    let emailsSent = 0;
    let emailsFailed = 0;

    // Process each important date
    for (const date of allDates) {
        const result = await processImportantDate(date);

        results.push({
            dateId: date.id,
            contactId: date.contactId,
            sent: result.sent,
            reason: result.reason || '',
        });

        if (result.sent) {
            emailsSent++;
        } else if (result.reason?.startsWith('Failed:')) {
            emailsFailed++;
        }
    }

    return {
        totalChecked: allDates.length,
        emailsSent,
        emailsFailed,
        results,
    };
}

/**
 * Manual trigger: Send a specific important date email immediately
 * Useful for testing or manual sends
 */
export async function sendImportantDateEmail(dateId: string): Promise<{
    success: boolean;
    message: string;
    emailLogId?: string;
}> {
    const allDates = getImportantDates();
    const date = allDates.find(d => d.id === dateId);

    if (!date) {
        return { success: false, message: 'Important date not found' };
    }

    const result = await processImportantDate(date);

    return {
        success: result.sent,
        message: result.reason || 'Unknown error',
        emailLogId: result.emailLogId,
    };
}
