export interface Stock {
  id: number;
  ticker: string;
  name: string;
  sector: string;
  market: 'US' | 'KR';
  currency: string;
  price: number;
  changePercent: number;
  marketCap: number;
  exchange: string;
  description: string;
}

export interface StockSearchResult {
  ticker: string;
  name: string;
  market: 'US' | 'KR';
  exchange: string;
  sector: string;
}

export interface StockFinancials {
  ticker: string;
  per: number;
  pbr: number;
  eps: number;
  dividendYield: number;
  revenue: number;
  operatingIncome: number;
  netIncome: number;
}
