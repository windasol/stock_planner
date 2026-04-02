import { useQuery } from '@tanstack/react-query';
import { stockApi } from '../api/stockApi';
import { QUERY_STALE_TIME } from '../utils/constants';

export function useStock(market: string, ticker: string) {
  return useQuery({
    queryKey: ['stock', market, ticker],
    queryFn: () => stockApi.getStock(market, ticker),
    staleTime: QUERY_STALE_TIME,
    enabled: !!market && !!ticker,
  });
}

export function useStockSearch(query: string, market?: string) {
  return useQuery({
    queryKey: ['stockSearch', query, market],
    queryFn: () => stockApi.search(query, market),
    staleTime: QUERY_STALE_TIME,
    enabled: query.length >= 1,
  });
}

export function useChartData(market: string, ticker: string, interval: string, from?: string, to?: string) {
  return useQuery({
    queryKey: ['chart', market, ticker, interval, from, to],
    queryFn: () => stockApi.getChartData(market, ticker, interval, from, to),
    staleTime: QUERY_STALE_TIME,
    enabled: !!market && !!ticker,
  });
}
