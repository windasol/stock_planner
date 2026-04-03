import { useQuery } from '@tanstack/react-query';
import { calendarApi } from '../api/calendarApi';

const CALENDAR_STALE_TIME = 60 * 60 * 1000; // 1시간

export function useEconomicCalendar(from?: string, to?: string) {
  return useQuery({
    queryKey: ['economicCalendar', from, to],
    queryFn: () => calendarApi.getEconomicCalendar(from, to),
    staleTime: CALENDAR_STALE_TIME,
  });
}

export function useStockEvents(symbol: string, from?: string, to?: string) {
  return useQuery({
    queryKey: ['stockEvents', symbol, from, to],
    queryFn: () => calendarApi.getStockEvents(symbol, from, to),
    staleTime: CALENDAR_STALE_TIME,
    enabled: symbol.length > 0,
  });
}
