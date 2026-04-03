import { useQuery } from '@tanstack/react-query';
import { newsApi } from '../api/newsApi';

const NEWS_STALE_TIME = 10 * 60 * 1000; // 10분

export function useNews(keyword: string, market?: string, limit = 20) {
  return useQuery({
    queryKey: ['news', keyword, market, limit],
    queryFn: () => newsApi.search(keyword, market, limit),
    staleTime: NEWS_STALE_TIME,
    enabled: keyword.length >= 1,
  });
}
