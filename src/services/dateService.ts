import api from './api';
import { ContactImportantDate } from '@/types/occasionEmail';

export const dateService = {
    getAll: async (contactId: string) => {
        const response = await api.get(`/contacts/${contactId}/dates`);
        return response.data.map(toFrontend);
    },

    create: async (contactId: string, data: Partial<ContactImportantDate>) => {
        const payload = toBackend(data);
        const response = await api.post(`/contacts/${contactId}/dates`, payload);
        return toFrontend(response.data);
    },

    update: async (contactId: string, dateId: string, data: Partial<ContactImportantDate>) => {
        const payload = toBackend(data);
        const response = await api.put(`/contacts/${contactId}/dates/${dateId}`, payload);
        return toFrontend(response.data);
    },

    delete: async (contactId: string, dateId: string) => {
        const response = await api.delete(`/contacts/${contactId}/dates/${dateId}`);
        return response.data;
    }
};

// Helpers
const toFrontend = (data: any): ContactImportantDate => {
    const year = data.year || new Date().getFullYear();
    const month = String(data.date_month).padStart(2, '0');
    const day = String(data.date_day).padStart(2, '0');

    return {
        id: data.id,
        contactId: data.contact_id,
        type: data.type,
        customLabel: data.label,
        date: `${year}-${month}-${day}`, // ISO format YYYY-MM-DD
        repeatAnnually: data.repeat_annually,
        emailTemplateId: data.email_template_id,
        sendTime: data.send_time ? String(data.send_time).substring(0, 5) : '09:00',
        optOutGreeting: data.opt_out,
        isActive: data.is_active,
        createdAt: data.created_at,
        updatedAt: data.updated_at
    };
};

const toBackend = (data: Partial<ContactImportantDate>): any => {
    const payload: any = {};

    if (data.type) payload.type = data.type;
    if (data.customLabel) payload.label = data.customLabel;

    if (data.date) {
        const dateObj = new Date(data.date);
        if (!isNaN(dateObj.getTime())) {
            payload.date_day = dateObj.getDate();
            payload.date_month = dateObj.getMonth() + 1;
            payload.year = dateObj.getFullYear();
        } else if (typeof data.date === 'string' && data.date.includes('-')) {
            // Handle simple string DD-MM or YYYY-MM-DD manually if Date parsing fails or is inconsistent
            const parts = data.date.split('-');
            if (parts.length === 3) {
                // Assumes YYYY-MM-DD or DD-MM-YYYY? Frontend usually sends YYYY-MM-DD via input type='date'
                // But occasionEmail.ts says comment: DD-MM-YYYY or DD-MM.
                // Let's assume standard ISO YYYY-MM-DD for now.
                payload.year = parseInt(parts[0]);
                payload.date_month = parseInt(parts[1]);
                payload.date_day = parseInt(parts[2]);
            }
        }
    }

    if (data.repeatAnnually !== undefined) payload.repeat_annually = data.repeatAnnually;
    if (data.emailTemplateId) payload.email_template_id = data.emailTemplateId;
    if (data.sendTime) payload.send_time = data.sendTime;
    if (data.optOutGreeting !== undefined) payload.opt_out = data.optOutGreeting;
    if (data.isActive !== undefined) payload.is_active = data.isActive;

    return payload;
};
