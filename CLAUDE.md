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
- `backend/src/main/java/com/stockplanner/`: config, controller, exception, model/{dto,entity,enums}, repository, service/external
- `frontend/src/`: api, components/{charts,common,portfolio,stock}, hooks, pages(5개), types, utils

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

## Implementation Status (남은 작업)
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

## Claude Code 사용 팁 (토큰 절약)
- 작업 전환 시 `/clear`, 대화가 길어지면 `/compact`
- 파일 지정 시 경로를 직접 명시: `frontend/src/pages/PortfolioPage.tsx`

## Key Conventions
- Korean UI text throughout (한국어 인터페이스)
- Chart colors: red=up, blue=down (한국 관례)
- Currency: USD ($), KRW (원, 조/억 단위)
- Market enum: US, KR
- No authentication required
