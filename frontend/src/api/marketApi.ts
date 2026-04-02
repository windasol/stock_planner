import axiosInstance from './axiosInstance';

export interface MarketIndex {
  name: string;
  value: number;
  changePercent: number;
  market: 'US' | 'KR';
}

export interface TopMover {
  ticker: string;
  name: string;
  price: number;
  changePercent: number;
  market: 'US' | 'KR';
}

export interface SectorPerformance {
  sector: string;
  changePercent: number;
}

export const marketApi = {
  getIndices: async () => {
    const { data } = await axiosInstance.get<MarketIndex[]>('/market/indices');
    return data;
  },

  getTopMovers: async (market?: string) => {
    const params = market ? { market } : {};
    const { data } = await axiosInstance.get<TopMover[]>('/market/top-movers', { params });
    return data;
  },

  getSectors: async () => {
    const { data } = await axiosInstance.get<SectorPerformance[]>('/market/sectors');
    return data;
  },
};
