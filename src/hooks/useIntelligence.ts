import { useQuery } from '@tanstack/react-query';
import { intelligenceService } from '@/services/intelligenceService';

export const useIntelligence = (accountId?: string) => {

    const { data: accountNews = [], isLoading: isLoadingAccount } = useQuery({
        queryKey: ['news', accountId],
        queryFn: () => intelligenceService.getAccountNews(accountId!),
        enabled: !!accountId,
    });

    const { data: feed = [], isLoading: isLoadingFeed } = useQuery({
        queryKey: ['news-feed'],
        queryFn: () => intelligenceService.getFeed(),
    });

    return {
        accountNews,
        feed,
        isLoading: isLoadingAccount || isLoadingFeed,
    };
};
