import type { Stock } from './stock';

export interface WatchlistItem {
  id: number;
  stock: Stock;
  note: string;
  addedAt: string;
}

export interface AddWatchlistRequest {
  ticker: string;
  market: 'US' | 'KR';
  note?: string;
}
