import axiosInstance from './axiosInstance';
import type { Portfolio, CreatePortfolioRequest, AddHoldingRequest } from '../types/portfolio';

export const portfolioApi = {
  getAll: async () => {
    const { data } = await axiosInstance.get<Portfolio[]>('/portfolios');
    return data;
  },

  getById: async (id: number) => {
    const { data } = await axiosInstance.get<Portfolio>(`/portfolios/${id}`);
    return data;
  },

  create: async (request: CreatePortfolioRequest) => {
    const { data } = await axiosInstance.post<Portfolio>('/portfolios', request);
    return data;
  },

  delete: async (id: number) => {
    await axiosInstance.delete(`/portfolios/${id}`);
  },

  addHolding: async (portfolioId: number, request: AddHoldingRequest) => {
    const { data } = await axiosInstance.post(`/portfolios/${portfolioId}/holdings`, request);
    return data;
  },

  updateHolding: async (portfolioId: number, holdingId: number, request: AddHoldingRequest) => {
    const { data } = await axiosInstance.put(`/portfolios/${portfolioId}/holdings/${holdingId}`, request);
    return data;
  },

  deleteHolding: async (portfolioId: number, holdingId: number) => {
    await axiosInstance.delete(`/portfolios/${portfolioId}/holdings/${holdingId}`);
  },
};
