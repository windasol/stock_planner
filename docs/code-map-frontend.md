# Code Map — Frontend

기준 경로: `frontend/src/`

---

## types/

| 파일 | export | 줄 |
|------|--------|----|
| `types/stock.ts` | `Stock` | 1 |
| | `StockSearchResult` | 15 |
| | `StockFinancials` | 23 |
| `types/portfolio.ts` | `Portfolio` | 3 |
| | `Holding` | 13 |
| | `CreatePortfolioRequest` | 23 |
| | `AddHoldingRequest` | 27 |
| `types/watchlist.ts` | `WatchlistItem` | 3 |
| | `AddWatchlistRequest` | 10 |
| `types/chart.ts` | `CandlestickData` | 1 |
| | `VolumeData` | 9 |
| | `ChartInterval` | 15 |

---

## api/

| 파일 | export | 메서드 | 줄 |
|------|--------|--------|----|
| `api/axiosInstance.ts` | `axiosInstance` | axios 설정 | 3–9 |
| | | 응답 interceptor | 11–18 |
| `api/stockApi.ts` | `stockApi` | search | 6 |
| | | getStock | 13 |
| | | getFinancials | 18 |
| | | getChartData | 23 |
| `api/portfolioApi.ts` | `portfolioApi` | getAll | 5 |
| | | getById | 10 |
| | | create | 15 |
| | | delete | 20 |
| | | addHolding | 24 |
| | | updateHolding | 29 |
| | | deleteHolding | 34 |
| `api/watchlistApi.ts` | `watchlistApi` | getAll | 5 |
| | | add | 10 |
| | | delete | 15 |
| `api/marketApi.ts` | `MarketIndex` (interface) | — | 3 |
| | `TopMover` (interface) | — | 10 |
| | `SectorPerformance` (interface) | — | 18 |
| | `marketApi` | API 메서드 | 24–38 |

---

## hooks/

| 파일 | export | 줄 |
|------|--------|----|
| `hooks/useStock.ts` | `useStock` | 5 |
| | `useStockSearch` | 14 |
| | `useChartData` | 23 |
| `hooks/usePortfolio.ts` | `usePortfolios` | 6 |
| | `usePortfolio` | 14 |
| | `useCreatePortfolio` | 23 |
| | `useAddHolding` | 31 |
| | `useDeletePortfolio` | 42 |
| | `useDeleteHolding` | 50 |
| `hooks/useWatchlist.ts` | `useWatchlist` | 6 |
| | `useAddToWatchlist` | 14 |
| | `useRemoveFromWatchlist` | 22 |

---

## pages/

| 파일 | export | 주요 섹션 | 줄 |
|------|--------|----------|----|
| `pages/DashboardPage.tsx` | `DashboardPage` | 시장 지수 | 62–92 |
| | | 관심종목 미리보기 | 97–145 |
| | | 포트폴리오 미리보기 | 147–207 |
| | `ChangeLabel` (내부) | — | 15 |
| `pages/SearchPage.tsx` | `SearchPage` | 검색 입력 | 19–33 |
| | | 결과 표시 | 41–44 |
| `pages/PortfolioPage.tsx` | `PortfolioPage` | 탭 구성 | 81–102 |
| | | 보유 관리 | 104–119 |
| | | 포트폴리오 생성 | 130–152 |
| `pages/StockDetailPage.tsx` | `StockDetailPage` | 날짜 범위 계산 | 13–24 |
| | | 상세 표시 | 38–56 |
| | `getDateRange` | — | 13 |
| `pages/WatchlistPage.tsx` | `WatchlistPage` | 핸들러 | 25–43 |
| | | 테이블 | 75–142 |
| | | 추가 모달 | 144–185 |

---

## components/common/

| 파일 | export | 줄 |
|------|--------|----|
| `components/common/Navbar.tsx` | `Navbar` | 11 |
| `components/common/SearchBar.tsx` | `SearchBar` | 6 |
| `components/common/LoadingSpinner.tsx` | `LoadingSpinner` | 7 |

---

## components/stock/

| 파일 | export | 줄 |
|------|--------|----|
| `components/stock/StockCard.tsx` | `StockCardProps` | 6 |
| | `StockCard` | 15 |
| `components/stock/StockInfo.tsx` | `StockInfoProps` | 6 |
| | `StockInfo` | 10 |
| `components/stock/StockSearchResults.tsx` | `StockSearchResultsProps` | 5 |
| | `StockSearchResults` | 9 |

---

## components/portfolio/

| 파일 | export | 줄 |
|------|--------|----|
| `components/portfolio/PortfolioSummary.tsx` | `PortfolioSummaryProps` | 6 |
| | `PortfolioSummary` | 10 |
| `components/portfolio/HoldingList.tsx` | `HoldingListProps` | 10 |
| | `HoldingList` | 15 |
| `components/portfolio/PortfolioChart.tsx` | `PortfolioChartProps` | 7 |
| | `PortfolioChart` | 11 |
| `components/portfolio/AddHoldingModal.tsx` | `AddHoldingModalProps` | 7 |
| | `AddHoldingModal` | 13 |

---

## components/charts/

| 파일 | export | 주요 섹션 | 줄 |
|------|--------|----------|----|
| `components/charts/CandlestickChart.tsx` | `CandlestickChartProps` | — | 7 |
| | `CandlestickChart` | 차트 초기화 | 12, 16–52 |
| | | 리사이즈 핸들러 | 55–59 |
| `components/charts/VolumeChart.tsx` | `VolumeChartProps` | — | 7 |
| | `VolumeChart` | 볼륨 차트 설정 | 12, 16–60 |
| `components/charts/ChartControls.tsx` | `ChartControlsProps` | — | 5 |
| | `ChartControls` | 인터벌 선택기 | 10–26 |

---

## utils/

| 파일 | export | 줄 |
|------|--------|----|
| `utils/constants.ts` | `CHART_INTERVALS` | 1 |
| | `MARKETS` | 10 |
| | `QUERY_STALE_TIME` | 16 |
| `utils/formatters.ts` | `formatCurrency` | 1 |
| | `formatPercent` | 8 |
| | `formatNumber` | 13 |
| | `formatMarketCap` | 21 |

---

## 진입점

| 파일 | 역할 | 주요 섹션 | 줄 |
|------|------|----------|----|
| `main.tsx` | 앱 진입점 | QueryClient 설정 | 8 |
| | | MUI 테마 | 17 |
| | | ReactDOM render | 29 |
| `App.tsx` | 루트 레이아웃 | Navbar + Outlet | 5–12 |
| `routes.tsx` | 라우트 정의 | createBrowserRouter (5개 라우트) | 9–21 |
