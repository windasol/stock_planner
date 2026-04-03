# Code Map — Backend

기준 경로: `backend/src/main/java/com/stockplanner/`

---

## controller/

| 파일 | 메서드 | HTTP | 줄 |
|------|--------|------|----|
| `controller/StockController.java` | search | GET /api/stocks/search | 19 |
| | getStock | GET /api/stocks/{market}/{ticker} | 26 |
| `controller/PortfolioController.java` | getAll | GET /api/portfolios | 20 |
| | getById | GET /api/portfolios/{id} | 25 |
| | create | POST /api/portfolios | 31 |
| | delete | DELETE /api/portfolios/{id} | 37 |
| | addHolding | POST /api/portfolios/{id}/holdings | 43 |
| | deleteHolding | DELETE /api/portfolios/{id}/holdings/{hId} | 51 |
| `controller/WatchlistController.java` | getAll | GET /api/watchlist | 21 |
| | add | POST /api/watchlist | 27 |
| | delete | DELETE /api/watchlist/{id} | 33 |
| `controller/ChartController.java` | getChartData | GET /api/charts/{market}/{ticker} | 18 |
| `controller/MarketController.java` | getIndices | GET /api/market/indices (stub) | 17 |
| | getTopMovers | GET /api/market/movers (stub) | 28 |
| | getSectors | GET /api/market/sectors (stub) | 34 |
| `controller/NewsController.java` | search | GET /api/news/search | 24 |

---

## service/

| 파일 | 메서드 | 줄 | 비고 |
|------|--------|-----|------|
| `service/StockService.java` | getStock | 24 | API 최신가 + DB 메타 병합 |
| | search | 39 | DB 검색 → API 보완 |
| | getOrCreateStock | 66 | |
| `service/PortfolioService.java` | getAll | 26 | |
| | getById | 32 | |
| | create | 36 | |
| | delete | 44 | |
| | addHolding | 49 | |
| | deleteHolding | 65 | |
| `service/WatchlistService.java` | getAll | 22 | |
| | add | 29 | |
| | delete | 39 | |
| `service/ChartService.java` | getChartData | 25 | |
| `service/NewsService.java` | searchNews | 25 | US/KR 뉴스 클라이언트 라우팅 |

---

## service/external/

| 파일 | 메서드 | 줄 | 비고 |
|------|--------|-----|------|
| `service/external/StockApiClient.java` | fetchQuote | 10 | interface |
| | fetchDailyPrices | 12 | interface |
| | searchStocks | 14 | interface |
| `service/external/TwelveDataClient.java` | fetchQuote | 39 | US/KR 구현체 (Caffeine 캐시) |
| | fetchTimeSeries | 80 | |
| | searchStocks | 121 | |
| `service/external/KisClient.java` | fetchQuote | 40 | KR stub (TODO, 캐시) |
| | fetchDailyPrices | 56 | |
| | searchStocks | 65 | |
| `service/external/NewsApiClient.java` | fetchNewsByKeyword | 8 | interface |
| | getSupportedMarket | 9 | interface |
| `service/external/AlphaVantageNewsClient.java` | getSupportedMarket | 39 | US 뉴스 구현체 (캐시) |
| | fetchNewsByKeyword | 45 | |
| `service/external/NaverNewsClient.java` | getSupportedMarket | 55 | KR 뉴스 구현체 (캐시) |
| | fetchNewsByKeyword | 61 | |

---

## repository/

| 파일 | 주요 쿼리 메서드 | 줄 |
|------|-----------------|-----|
| `repository/StockRepository.java` | findByTickerIgnoreCase | 14 |
| | findByTickerIgnoreCaseAndMarket | 16 |
| | search (JPQL) | 18–22 |
| `repository/PortfolioRepository.java` | (기본 CRUD) | — |
| `repository/PortfolioHoldingRepository.java` | (기본 CRUD) | — |
| `repository/PriceHistoryRepository.java` | findByStockAndDateBetweenOrderByDateAsc | 13 |
| | findTopByStockOrderByDateDesc | 15 |
| `repository/WatchlistRepository.java` | findAllByOrderByAddedAtDesc | 10 |

---

## model/entity/

| 파일 | 주요 필드 | 줄 |
|------|----------|----|
| `model/entity/Stock.java` | 필드 | 18–45 |
| | @PrePersist | 48–52 |
| `model/entity/Portfolio.java` | 필드 | 18–30 |
| | @PrePersist | 32–35 |
| `model/entity/PortfolioHolding.java` | 필드 | 18–36 |
| `model/entity/PriceHistory.java` | 필드 | 18–43 |
| `model/entity/Watchlist.java` | 필드 | 18–28 |
| | @PrePersist | 30–33 |

---

## model/dto/

| 파일 | 필드 줄 | 비고 |
|------|---------|------|
| `model/dto/StockDto.java` | 11–21 | |
| `model/dto/PortfolioDto.java` | 13–19 | `List<HoldingDto>` 포함 |
| `model/dto/HoldingDto.java` | 11–17 | `StockDto` 포함 |
| `model/dto/ChartDataDto.java` | 11–16 | |
| `model/dto/WatchlistDto.java` | 11–14 | `StockDto` 포함 |
| `model/dto/SearchResultDto.java` | 11–15 | |
| `model/dto/CreatePortfolioRequest.java` | 11–12 | |
| `model/dto/AddHoldingRequest.java` | 12–24 | |
| `model/dto/AddWatchlistRequest.java` | 11–17 | |
| `model/dto/NewsDto.java` | — | 뉴스 항목 DTO |

---

## model/enums/

| 파일 | 값 | 줄 |
|------|----|----|
| `model/enums/Market.java` | `US`, `KR` | 3–4 |
| `model/enums/ChartInterval.java` | 값 정의 | 3–12 |
| | getValue | 14 |
| | fromValue | 18 |

---

## exception/

| 파일 | 처리 | 줄 |
|------|------|----|
| `exception/GlobalExceptionHandler.java` | StockNotFoundException → 404 | 14–20 |
| | ExternalApiException → 502 | 22–28 |
| | IllegalArgumentException → 400 | 30–36 |
| `exception/StockNotFoundException.java` | 정의 | 3–7 |
| `exception/ExternalApiException.java` | 정의 | 3–11 |

---

## config/

| 파일 | 역할 | 줄 |
|------|------|----|
| `config/WebConfig.java` | CORS (localhost:5173 허용) | 11 |
| `config/RestTemplateConfig.java` | RestTemplate bean | 17 |
| `config/CacheConfig.java` | Caffeine CacheManager bean | 17 |
| `config/KoreanStockSeeder.java` | ApplicationRunner (한국 종목 시드) | 76 |
| `StockPlannerApplication.java` | 앱 진입점 (@EnableCaching) | 11 |
