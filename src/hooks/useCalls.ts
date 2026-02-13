import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { callService } from '@/services/callService';

export const useCalls = (filters?: { contactId?: string; userId?: string }) => {
    const queryClient = useQueryClient();
    const queryKey = ['calls', filters];

    const { data: calls = [], isLoading, error } = useQuery({
        queryKey,
        queryFn: () => callService.getAll(filters),
    });

    const createMutation = useMutation({
        mutationFn: (data: any) => callService.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey });
        },
    });

    return {
        calls,
        isLoading,
        error,
        createCall: createMutation.mutate,
    };
};
