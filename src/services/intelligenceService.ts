import api from './api';

export const intelligenceService = {
    getAccountNews: async (accountId: string) => {
        const response = await api.get(`/intelligence/news/${accountId}`);
        return response.data.map(toFrontend);
    },

    getFeed: async () => {
        const response = await api.get(`/intelligence/feed`);
        return response.data.map(toFrontend);
    }
};

const toFrontend = (data: any): any => { // Returning any to satisfy AccountNewsItem structure loosely
    return {
        id: data.id,
        accountId: data.account_id,
        title: data.title,
        summary: data.summary,
        sourceName: data.source_name || 'Unknown Source',
        sourceUrl: data.source_url,
        publishedAt: data.published_at,
        ingestedAt: data.created_at,
        tags: ['Other'], // Default
        relevanceScore: (data.sentiment_score || 0) > 0.7 ? 'High' : 'Medium',
        matchedTerms: [],
        status: 'active',
        isDuplicate: false,
        createdAt: data.created_at,
        updatedAt: data.created_at
    };
};
