import axiosInstance from './axiosInstance';
import { Stock, StockSearchResult, StockFinancials } from '../types/stock';
import { CandlestickData } from '../types/chart';

export const stockApi = {
  search: async (query: string, market?: string, page = 0) => {
    const params: Record<string, string | number> = { q: query, page };
    if (market) params.market = market;
    const { data } = await axiosInstance.get<StockSearchResult[]>('/stocks/search', { params });
    return data;
  },

  getStock: async (market: string, ticker: string) => {
    const { data } = await axiosInstance.get<Stock>(`/stocks/${market}/${ticker}`);
    return data;
  },

  getFinancials: async (market: string, ticker: string) => {
    const { data } = await axiosInstance.get<StockFinancials>(`/stocks/${market}/${ticker}/financials`);
    return data;
  },

  getChartData: async (market: string, ticker: string, interval: string, from?: string, to?: string) => {
    const params: Record<string, string> = { interval };
    if (from) params.from = from;
    if (to) params.to = to;
    const { data } = await axiosInstance.get<CandlestickData[]>(`/charts/${market}/${ticker}`, { params });
    return data;
  },
};
