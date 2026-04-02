import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { watchlistApi } from '../api/watchlistApi';
import { AddWatchlistRequest } from '../types/watchlist';
import { QUERY_STALE_TIME } from '../utils/constants';

export function useWatchlist() {
  return useQuery({
    queryKey: ['watchlist'],
    queryFn: watchlistApi.getAll,
    staleTime: QUERY_STALE_TIME,
  });
}

export function useAddToWatchlist() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (request: AddWatchlistRequest) => watchlistApi.add(request),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['watchlist'] }),
  });
}

export function useRemoveFromWatchlist() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => watchlistApi.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['watchlist'] }),
  });
}
