import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { socialService } from '@/services/socialService';

export const useSocialProfiles = (contactId: string) => {
    const queryClient = useQueryClient();
    const queryKey = ['social-profiles', contactId];

    const { data: profiles = [], isLoading, error } = useQuery({
        queryKey,
        queryFn: () => socialService.getAll(contactId),
        enabled: !!contactId,
    });

    const createMutation = useMutation({
        mutationFn: (data: any) => socialService.create(contactId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey });
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({ profileId, data }: { profileId: string; data: any }) =>
            socialService.update(contactId, profileId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (profileId: string) => socialService.delete(contactId, profileId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey });
        },
    });

    return {
        accounts: profiles, // Expose as 'accounts' to match component usage
        isLoading,
        error,
        createProfile: createMutation.mutate,
        updateProfile: updateMutation.mutate,
        disconnectAccount: (id: string, options?: any) => {
            // Treat disconnect as delete for now, or update status if backend supports it
            // Using update to set status to 'disconnected' if preferred, but existing UI called disconnect
            // Let's assume disconnect = update status
            updateMutation.mutate({ profileId: id, data: { status: 'disconnected' } }, options);
        },
        deleteAccount: deleteMutation.mutate,
    };
};
