import DOMPurify from 'dompurify';

export const sanitize = (content: string): string => {
    return DOMPurify.sanitize(content, {
        USE_PROFILES: { html: true },
    });
};
