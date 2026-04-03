import axiosInstance from './axiosInstance';
import type { EconomicEvent, StockEvent } from '../types/calendar';

export const calendarApi = {
  getEconomicCalendar: (from?: string, to?: string): Promise<EconomicEvent[]> => {
    const params: Record<string, string> = {};
    if (from) params.from = from;
    if (to) params.to = to;
    return axiosInstance.get('/calendar/economic', { params }).then(r => r.data);
  },

  getStockEvents: (symbol: string, from?: string, to?: string): Promise<StockEvent[]> => {
    const params: Record<string, string> = {};
    if (from) params.from = from;
    if (to) params.to = to;
    return axiosInstance.get(`/calendar/stock/${symbol}`, { params }).then(r => r.data);
  },
};
