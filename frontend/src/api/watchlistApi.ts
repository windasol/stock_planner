import axiosInstance from './axiosInstance';
import type { WatchlistItem, AddWatchlistRequest } from '../types/watchlist';

export const watchlistApi = {
  getAll: async () => {
    const { data } = await axiosInstance.get<WatchlistItem[]>('/watchlist');
    return data;
  },

  add: async (request: AddWatchlistRequest) => {
    const { data } = await axiosInstance.post<WatchlistItem>('/watchlist', request);
    return data;
  },

  delete: async (id: number) => {
    await axiosInstance.delete(`/watchlist/${id}`);
  },
};
