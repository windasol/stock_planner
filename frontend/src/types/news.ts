export interface NewsItem {
  title: string;
  summary: string;
  url: string;
  source: string;
  publishedAt: string;
  sentiment: string | null;    // positive, negative, neutral 또는 AV 레이블
  sentimentScore: number | null;
  market: string;              // US, KR
}
