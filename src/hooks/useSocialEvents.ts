import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { socialService } from '@/services/socialService';

export const useSocialEvents = (contactId: string) => {
    const queryClient = useQueryClient();
    const queryKey = ['social-events', contactId];

    const { data: events = [], isLoading, error } = useQuery({
        queryKey,
        queryFn: () => socialService.getEvents(contactId),
        enabled: !!contactId,
    });

    return {
        events,
        isLoading,
        error
    };
};
