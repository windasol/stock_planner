export const formatCurrency = (value: number, currency: string = 'USD'): string => {
  if (currency === 'KRW') {
    return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(value);
  }
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
};

export const formatPercent = (value: number): string => {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
};

export const formatNumber = (value: number): string => {
  if (value >= 1_000_000_000_000) return `${(value / 1_000_000_000_000).toFixed(1)}T`;
  if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(1)}B`;
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  return value.toFixed(0);
};

export const formatMarketCap = (value: number, currency: string = 'USD'): string => {
  if (currency === 'KRW') {
    if (value >= 1_000_000_000_000) return `${(value / 1_000_000_000_000).toFixed(1)}조`;
    if (value >= 100_000_000) return `${(value / 100_000_000).toFixed(0)}억`;
    return `${value.toLocaleString('ko-KR')}원`;
  }
  return formatNumber(value);
};
