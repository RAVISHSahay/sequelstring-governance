import api from './api';

export const callService = {
    getAll: async (params?: { contactId?: string; userId?: string }) => {
        // Convert camelCase params to snake_case if needed by backend, 
        // but my backend endpoint uses contact_id and user_id query params.
        // Axios params serialization handles simple objects.
        const queryParams: any = {};
        if (params?.contactId) queryParams.contact_id = params.contactId;
        if (params?.userId) queryParams.user_id = params.userId;

        const response = await api.get(`/calls/`, { params: queryParams });
        return response.data;
    },

    create: async (data: any) => {
        const response = await api.post(`/calls/`, data);
        return response.data;
    }
};
