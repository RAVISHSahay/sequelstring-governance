import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { dateService } from '@/services/dateService';
import { ContactImportantDate } from '@/types/occasionEmail';

export const useImportantDates = (contactId: string) => {
    const queryClient = useQueryClient();
    const queryKey = ['important-dates', contactId];

    const { data: dates = [], isLoading, error } = useQuery({
        queryKey,
        queryFn: () => dateService.getAll(contactId),
        enabled: !!contactId,
    });

    const createMutation = useMutation({
        mutationFn: (data: Partial<ContactImportantDate>) => dateService.create(contactId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey });
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({ dateId, data }: { dateId: string; data: Partial<ContactImportantDate> }) =>
            dateService.update(contactId, dateId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (dateId: string) => dateService.delete(contactId, dateId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey });
        },
    });

    return {
        dates,
        isLoading,
        error,
        createDate: createMutation.mutate,
        updateDate: updateMutation.mutate,
        deleteDate: deleteMutation.mutate,
    };
};
