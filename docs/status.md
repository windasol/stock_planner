# Implementation Status

## Phases

- [x] Phase 1: 프로젝트 기반 (Spring Boot + React + Docker + Git)
- [x] Phase 2: 백엔드 전체 (Entity, Repository, Service, Controller, API clients)
- [x] Phase 3: 프론트엔드 컴포넌트 (차트, 검색, 종목 상세, 포트폴리오)
- [x] Phase 4: PortfolioPage.tsx 조합
- [x] Phase 5: WatchlistPage.tsx + DashboardPage.tsx
- [ ] Phase 6: ErrorBoundary, 반응형, 테스트

## Project Structure

```
stock_planner/
├── backend/src/main/java/com/stockplanner/
│   ├── config/         # WebConfig, RestTemplateConfig
│   ├── controller/     # REST Controllers (/api/*)
│   ├── exception/      # GlobalExceptionHandler, custom exceptions
│   ├── model/
│   │   ├── dto/        # Request/Response DTOs
│   │   ├── entity/     # JPA Entities
│   │   └── enums/      # Market, ChartInterval
│   ├── repository/     # Spring Data JPA Repositories
│   └── service/
│       └── external/   # StockApiClient + implementations
├── frontend/src/
│   ├── api/            # Axios API modules
│   ├── components/     # charts/, common/, portfolio/, stock/
│   ├── hooks/          # React Query custom hooks
│   ├── pages/          # 5 pages
│   ├── types/          # TypeScript interfaces
│   └── utils/          # formatters, constants
└── docker-compose.yml
```
