import axiosInstance from './axiosInstance';
import type { NewsItem } from '../types/news';

export const newsApi = {
  search: async (keyword: string, market?: string, limit = 20) => {
    const params: Record<string, string | number> = { q: keyword, limit };
    if (market) params.market = market;
    const { data } = await axiosInstance.get<NewsItem[]>('/news/search', { params });
    return data;
  },
};
