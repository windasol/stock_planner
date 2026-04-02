export interface CandlestickData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
}

export interface VolumeData {
  time: string;
  value: number;
  color: string;
}

export type ChartInterval = '1D' | '1W' | '1M' | '3M' | '1Y' | 'ALL';
