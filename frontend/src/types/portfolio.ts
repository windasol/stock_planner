import { Stock } from './stock';

export interface Portfolio {
  id: number;
  name: string;
  holdings: Holding[];
  totalValue: number;
  totalReturn: number;
  totalReturnPercent: number;
  createdAt: string;
}

export interface Holding {
  id: number;
  stock: Stock;
  quantity: number;
  avgBuyPrice: number;
  currentValue: number;
  returnPercent: number;
  boughtAt: string;
}

export interface CreatePortfolioRequest {
  name: string;
}

export interface AddHoldingRequest {
  ticker: string;
  market: 'US' | 'KR';
  quantity: number;
  avgBuyPrice: number;
  boughtAt: string;
}
