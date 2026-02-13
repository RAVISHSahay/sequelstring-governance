import api from './api';

export const socialService = {
    getAll: async (contactId: string) => {
        const response = await api.get(`/contacts/${contactId}/social`);
        return response.data;
    },

    create: async (contactId: string, data: any) => {
        const response = await api.post(`/contacts/${contactId}/social`, data);
        return response.data;
    },

    update: async (contactId: string, profileId: string, data: any) => {
        const response = await api.patch(`/contacts/${contactId}/social/${profileId}`, data);
        return response.data;
    },

    delete: async (contactId: string, profileId: string) => {
        const response = await api.delete(`/contacts/${contactId}/social/${profileId}`);
        return response.data;
    },

    getEvents: async (contactId: string) => {
        const response = await api.get(`/contacts/${contactId}/social/events`);
        return response.data.map(toFrontendEvent);
    }
};

const toFrontendEvent = (data: any): any => {
    return {
        id: data.id,
        contactId: data.contact_id,
        socialAccountId: data.social_account_id,
        platform: data.platform,
        eventType: data.event_type,
        externalEventId: data.id, // Or specific field if available
        title: data.title,
        content: data.content,
        eventUrl: data.event_url,
        eventTime: data.event_time,
        engagement: { likes: 0, comments: 0, shares: 0 }, // Mock for now if not in DB
        isRead: data.is_read || false,
        isActionable: true,
        createdAt: data.created_at
    };
};
