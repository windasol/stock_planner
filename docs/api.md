# API Reference

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | /api/stocks/search?q=&market= | 종목 검색 |
| GET | /api/stocks/{market}/{ticker} | 종목 상세 |
| GET | /api/charts/{market}/{ticker}?interval= | 차트 데이터 |
| GET/POST/DELETE | /api/portfolios/** | 포트폴리오 CRUD |
| GET/POST/DELETE | /api/watchlist | 관심종목 CRUD |
| GET | /api/market/indices | 시장 지수 |

## External APIs

| Market | Provider | Env Keys |
|--------|----------|----------|
| US | Alpha Vantage | `ALPHA_VANTAGE_API_KEY` |
| KR | 한국투자증권 OpenAPI (stub) | `KIS_APP_KEY`, `KIS_APP_SECRET` |

## Caching Strategy

3-tier: **Caffeine (5min)** → **PostgreSQL (persistent)** → **React Query (5min staleTime)**
