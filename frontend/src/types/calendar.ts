export interface EconomicEvent {
  date: string;       // yyyy-MM-dd
  time: string;       // HH:mm (UTC)
  country: string;
  event: string;
  impact: 'high' | 'medium' | 'low' | string;
  unit: string;
  actual: number | null;
  estimate: number | null;
  previous: number | null;
}

export interface StockEvent {
  date: string;
  type: 'EARNINGS' | 'DIVIDEND' | 'SPLIT';
  description: string;

  // 실적
  epsEstimate: number | null;
  epsActual: number | null;
  revenueEstimate: number | null;
  revenueActual: number | null;
  hour: string | null;
  quarter: number | null;
  year: number | null;

  // 배당
  dividendAmount: number | null;
  payDate: string | null;
  recordDate: string | null;
  currency: string | null;

  // 분할
  fromFactor: number | null;
  toFactor: number | null;
}
