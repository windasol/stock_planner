# Stock Planner - AI Assistant Context

## Project Overview
주식 투자 플래너 웹 애플리케이션 (미국 + 한국 시장 지원, 인증 없음)

## Tech Stack
- **Backend**: Spring Boot 3.2.5 / Java 17 / Maven / PostgreSQL 16
- **Frontend**: React 19 + TypeScript / Vite 8 / MUI 7 / TanStack Query 5
- **Infra**: Docker Compose (PostgreSQL)

## Architecture References
- Backend conventions: `docs/java.md`
- Frontend conventions: `docs/front.md`

## Project Structure
```
stock_planner/
├── backend/                    # Spring Boot (port 8080)
│   └── src/main/java/com/stockplanner/
│       ├── config/             # WebConfig, RestTemplateConfig
│       ├── controller/         # REST Controllers (/api/*)
│       ├── exception/          # GlobalExceptionHandler, custom exceptions
│       ├── model/
│       │   ├── dto/            # Request/Response DTOs
│       │   ├── entity/         # JPA Entities
│       │   └── enums/          # Market, ChartInterval
│       ├── repository/         # Spring Data JPA Repositories
│       └── service/
│           └── external/       # StockApiClient interface + implementations
├── frontend/                   # React + Vite (port 5173, proxy /api -> 8080)
│   └── src/
│       ├── api/                # Axios API modules
│       ├── components/
│       │   ├── charts/         # CandlestickChart, VolumeChart, ChartControls
│       │   ├── common/         # Navbar, SearchBar, LoadingSpinner
│       │   ├── portfolio/      # PortfolioSummary, HoldingList, AddHoldingModal, PortfolioChart
│       │   └── stock/          # StockInfo, StockCard, StockSearchResults
│       ├── hooks/              # React Query custom hooks
│       ├── pages/              # Page components (5 pages)
│       ├── types/              # TypeScript interfaces
│       └── utils/              # formatters, constants
└── docker-compose.yml          # PostgreSQL container
```

## API Endpoints
| Method | Path | Description |
|--------|------|-------------|
| GET | /api/stocks/search?q=&market= | 종목 검색 |
| GET | /api/stocks/{market}/{ticker} | 종목 상세 |
| GET | /api/charts/{market}/{ticker}?interval= | 차트 데이터 |
| GET/POST/DELETE | /api/portfolios/** | 포트폴리오 CRUD |
| GET/POST/DELETE | /api/watchlist | 관심종목 CRUD |
| GET | /api/market/indices | 시장 지수 |

## External APIs
- **US Market**: Alpha Vantage API (key: `ALPHA_VANTAGE_API_KEY` env)
- **KR Market**: 한국투자증권 OpenAPI (stub - `KIS_APP_KEY`, `KIS_APP_SECRET`)

## Caching Strategy
3-tier: Caffeine (5min) -> PostgreSQL (persistent) -> React Query (5min staleTime)

## Implementation Status
- [x] Phase 1: Project setup (Spring Boot + React + Docker + Git)
- [x] Phase 2: Backend full (Entity, Repository, Service, Controller, API clients)
- [x] Phase 3: Frontend components (charts, search, stock detail, portfolio components)
- [ ] Phase 4: PortfolioPage.tsx 조합 (컴포넌트는 완성, 페이지 미연결)
- [ ] Phase 5: WatchlistPage.tsx + DashboardPage.tsx 구현
- [ ] Phase 6: ErrorBoundary, 반응형, 테스트

## Commands
```bash
# Backend
cd backend && ./mvnw spring-boot:run

# Frontend
cd frontend && npm run dev        # dev server (port 5173)
cd frontend && npm run build      # production build

# Database
docker-compose up -d              # PostgreSQL (port 5432)
```

## Key Conventions
- Korean UI text throughout (한국어 인터페이스)
- Chart colors: red=up, blue=down (한국 관례)
- Currency: USD ($), KRW (원, 조/억 단위)
- Market enum: US, KR
- No authentication required
