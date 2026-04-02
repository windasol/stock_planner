export const CHART_INTERVALS = [
  { label: '1일', value: '1D' },
  { label: '1주', value: '1W' },
  { label: '1개월', value: '1M' },
  { label: '3개월', value: '3M' },
  { label: '1년', value: '1Y' },
  { label: '전체', value: 'ALL' },
] as const;

export const MARKETS = [
  { label: '전체', value: '' },
  { label: '미국', value: 'US' },
  { label: '한국', value: 'KR' },
] as const;

export const QUERY_STALE_TIME = 5 * 60 * 1000; // 5 minutes
