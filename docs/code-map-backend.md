# Code Map — Backend

기준 경로: `backend/src/main/java/com/stockplanner/`

---

## controller/

| 파일 | 메서드 | HTTP | 줄 |
|------|--------|------|----|
| `controller/StockController.java` | search | GET /api/stocks/search | 18–23 |
| | getStock | GET /api/stocks/{market}/{ticker} | 25–30 |
| `controller/PortfolioController.java` | getAll | GET /api/portfolios | 19–21 |
| | getById | GET /api/portfolios/{id} | 24–26 |
| | create | POST /api/portfolios | 29–32 |
| | delete | DELETE /api/portfolios/{id} | 35–38 |
| | addHolding | POST /api/portfolios/{id}/holdings | 41–46 |
| | deleteHolding | DELETE /api/portfolios/{id}/holdings/{hId} | 49–55 |
| `controller/WatchlistController.java` | getAll | GET /api/watchlist | 20–22 |
| | add | POST /api/watchlist | 25–28 |
| | delete | DELETE /api/watchlist/{id} | 31–34 |
| `controller/ChartController.java` | getChartData | GET /api/charts/{market}/{ticker} | 17–25 |
| `controller/MarketController.java` | getIndices | GET /api/market/indices (stub) | 16–25 |
| | getTopMovers | GET /api/market/movers (stub) | 27–31 |
| | getSectors | GET /api/market/sectors (stub) | 33–37 |

---

## service/

| 파일 | 메서드 | 줄 | 비고 |
|------|--------|-----|------|
| `service/StockService.java` | getStock | 27–40 | DB → 외부API fallback |
| | search | 42–80 | 검색 + DB 보완 |
| | getOrCreateStock | 82–97 | |
| | toDto | 113–125 | Entity → DTO 변환 |
| `service/PortfolioService.java` | getAll | 26–30 | |
| | getById | 32–34 | |
| | create | 36–42 | |
| | delete | 44–47 | |
| | addHolding | 49–63 | |
| | deleteHolding | 65–70 | |
| | toDto (portfolio) | 74–95 | |
| | toDto (holding) | 97–119 | |
| `service/WatchlistService.java` | getAll | 22–27 | |
| | add | 29–37 | |
| | delete | 39–41 | |
| | toDto | 43–56 | |
| `service/ChartService.java` | getChartData | 28–70 | DB캐시(35–42) → 외부API(45–51) → DB저장(54–69) |

---

## service/external/

| 파일 | 메서드 | 줄 | 비고 |
|------|--------|-----|------|
| `service/external/StockApiClient.java` | fetchQuote | 10 | interface |
| | fetchDailyPrices | 12 | interface |
| | searchStocks | 14 | interface |
| `service/external/AlphaVantageClient.java` | fetchQuote | 37–59 | US 구현체 |
| | fetchDailyPrices | 63–99 | |
| | searchStocks | 103–128 | |
| | 파싱 헬퍼 | 130–156 | |
| `service/external/KisClient.java` | fetchQuote | 40–55 | KR stub (TODO) |
| | fetchDailyPrices | 56–63 | |
| | searchStocks | 65–70 | |

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
| `config/WebConfig.java` | CORS (localhost:5173 허용) | 11–16 |
| `config/RestTemplateConfig.java` | RestTemplate bean | 11–13 |
| `StockPlannerApplication.java` | 앱 진입점 (@EnableCaching) | 9–14 |
