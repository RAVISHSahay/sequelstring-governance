import { PersonalizationTokens } from '@/types/occasionEmail';

/**
 * Replace personalization tokens in email template
 * Tokens are in the format: {{token_name}}
 */
export function replaceTokens(template: string, tokens: PersonalizationTokens): string {
    let result = template;

    // Replace each token
    Object.entries(tokens).forEach(([key, value]) => {
        const tokenPattern = new RegExp(`{{${key}}}`, 'g');
        result = result.replace(tokenPattern, value || '');
    });

    // Remove any remaining unmatched tokens
    result = result.replace(/{{[^}]+}}/g, '');

    return result;
}

/**
 * Extract all tokens from a template string
 */
export function extractTokens(template: string): string[] {
    const tokenPattern = /{{([^}]+)}}/g;
    const tokens: string[] = [];
    let match;

    while ((match = tokenPattern.exec(template)) !== null) {
        tokens.push(match[1]);
    }

    return [...new Set(tokens)]; // Remove duplicates
}

/**
 * Validate that all required tokens have values
 */
export function validateTokens(template: string, tokens: PersonalizationTokens): {
    valid: boolean;
    missingTokens: string[];
} {
    const required = extractTokens(template);
    const missing = required.filter(token => !tokens[token] || tokens[token].trim() === '');

    return {
        valid: missing.length === 0,
        missingTokens: missing,
    };
}

/**
 * Get preview of email with sample data
 */
export function getEmailPreview(
    subject: string,
    body: string,
    tokens: Partial<PersonalizationTokens>
): { subject: string; body: string } {
    const sampleTokens: PersonalizationTokens = {
        first_name: tokens.first_name || 'John',
        last_name: tokens.last_name || 'Doe',
        company_name: tokens.company_name || 'Company Inc.',
        designation: tokens.designation || 'Manager',
        occasion_label: tokens.occasion_label || 'Special Day',
        sender_name: tokens.sender_name || 'Sales Team',
        sender_email: tokens.sender_email || 'sales@company.com',
        ...tokens,
    };

    return {
        subject: replaceTokens(subject, sampleTokens),
        body: replaceTokens(body, sampleTokens),
    };
}

/**
 * Available personalization tokens with descriptions
 */
export const AVAILABLE_TOKENS = [
    { token: 'first_name', description: 'Contact first name', example: 'John' },
    { token: 'last_name', description: 'Contact last name', example: 'Doe' },
    { token: 'company_name', description: 'Company name', example: 'Tech Corp' },
    { token: 'designation', description: 'Job title/designation', example: 'VP Engineering' },
    { token: 'occasion_label', description: 'Custom occasion label', example: 'Work Anniversary' },
    { token: 'sender_name', description: 'Sender name', example: 'Priya Sharma' },
    { token: 'sender_email', description: 'Sender email', example: 'priya@company.com' },
];
