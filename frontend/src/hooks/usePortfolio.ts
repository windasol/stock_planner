import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { portfolioApi } from '../api/portfolioApi';
import type { CreatePortfolioRequest, AddHoldingRequest } from '../types/portfolio';
import { QUERY_STALE_TIME } from '../utils/constants';

export function usePortfolios() {
  return useQuery({
    queryKey: ['portfolios'],
    queryFn: portfolioApi.getAll,
    staleTime: QUERY_STALE_TIME,
  });
}

export function usePortfolio(id: number) {
  return useQuery({
    queryKey: ['portfolio', id],
    queryFn: () => portfolioApi.getById(id),
    staleTime: QUERY_STALE_TIME,
    enabled: !!id,
  });
}

export function useCreatePortfolio() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (request: CreatePortfolioRequest) => portfolioApi.create(request),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['portfolios'] }),
  });
}

export function useAddHolding(portfolioId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (request: AddHoldingRequest) => portfolioApi.addHolding(portfolioId, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolio', portfolioId] });
      queryClient.invalidateQueries({ queryKey: ['portfolios'] });
    },
  });
}

export function useDeletePortfolio() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => portfolioApi.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['portfolios'] }),
  });
}

export function useDeleteHolding(portfolioId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (holdingId: number) => portfolioApi.deleteHolding(portfolioId, holdingId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolio', portfolioId] });
      queryClient.invalidateQueries({ queryKey: ['portfolios'] });
    },
  });
}
