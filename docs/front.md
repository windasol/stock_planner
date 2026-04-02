# Frontend Convention - React + TypeScript

## Architecture

```
Pages (Route-level Components)
    ↓ compose
Components (Reusable UI)
    ↓ use
Hooks (Data Fetching + State)
    ↓ call
API Layer (Axios)
    ↓ HTTP
Backend (/api/*)
```

## Directory Structure

```
src/
├── api/            # Axios 인스턴스 + API 모듈 (도메인별 분리)
├── components/     # 재사용 UI 컴포넌트
│   ├── charts/     # 차트 관련 (CandlestickChart, VolumeChart, ChartControls)
│   ├── common/     # 공통 (Navbar, SearchBar, LoadingSpinner)
│   ├── portfolio/  # 포트폴리오 관련
│   └── stock/      # 종목 관련
├── hooks/          # Custom hooks (React Query wrapper)
├── pages/          # 라우트 페이지 컴포넌트
├── types/          # TypeScript interface 정의
└── utils/          # 유틸리티 함수 (formatters, constants)
```

## Naming Convention

| 대상 | 규칙 | 예시 |
|------|------|------|
| Component | PascalCase, 기능 명시 | `StockCard.tsx`, `AddHoldingModal.tsx` |
| Hook | `use{Domain}{Action}` | `useStock`, `useStockSearch`, `useAddHolding` |
| API module | `{domain}Api.ts` | `stockApi.ts`, `portfolioApi.ts` |
| Type file | `{domain}.ts` | `stock.ts`, `portfolio.ts` |
| Page | `{Name}Page.tsx` | `DashboardPage.tsx`, `StockDetailPage.tsx` |
| Util | camelCase | `formatCurrency`, `formatPercent` |

## Component 규칙

### Function Component (Arrow Function 금지 - `export default function` 사용)

```tsx
interface ComponentProps {
  prop1: Type;
  prop2?: OptionalType;
}

export default function ComponentName({ prop1, prop2 }: ComponentProps) {
  // hooks
  // handlers
  // render
  return <JSX />;
}
```

- `export default function` 패턴 일관 사용
- Props interface는 같은 파일 상단에 정의
- 조건부 early return 허용 (`if (loading) return <Spinner />`)

### Component 분류

| 분류 | 위치 | 특징 |
|------|------|------|
| **Page** | `pages/` | 라우트 단위, 컴포넌트 조합, 데이터 fetch |
| **Feature** | `components/{domain}/` | 도메인 특화, Props로 데이터 수신 |
| **Common** | `components/common/` | 재사용, 도메인 무관 |

## State Management

### Server State: TanStack React Query

```tsx
// hooks/use{Domain}.ts
export function useStock(market: string, ticker: string) {
  return useQuery({
    queryKey: ['stock', market, ticker],
    queryFn: () => stockApi.getStock(market, ticker),
    enabled: !!ticker,
  });
}

// Mutation
export function useAddHolding(portfolioId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: AddHoldingRequest) => portfolioApi.addHolding(portfolioId, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['portfolio', portfolioId] }),
  });
}
```

- queryKey: `[domain, ...params]` 패턴
- staleTime: 5분 (QueryClient 전역 설정)
- Mutation 성공 시 관련 query invalidate

### Client State: Zustand (필요시)
- 서버 데이터는 React Query, UI 상태만 Zustand 사용

## API Layer

```tsx
// api/axiosInstance.ts - 공통 설정
const api = axios.create({ baseURL: '/api', timeout: 10000 });

// api/{domain}Api.ts - 도메인별 분리
export const stockApi = {
  search: (q: string, market?: string) => api.get('/stocks/search', { params: { q, market } }).then(r => r.data),
  getStock: (market: string, ticker: string) => api.get(`/stocks/${market}/${ticker}`).then(r => r.data),
};
```

- baseURL: `/api` (Vite proxy -> localhost:8080)
- 응답: `.then(r => r.data)`로 AxiosResponse unwrap
- 에러: interceptor에서 공통 처리

## TypeScript

```tsx
// types/{domain}.ts
export interface Stock {
  id: number;
  ticker: string;
  name: string;
  market: string;      // "US" | "KR"
  currency: string;    // "USD" | "KRW"
  // ...
}
```

- `interface` 사용 (`type` 보다 interface 선호)
- Backend DTO와 1:1 매핑
- Optional 필드: `?` 사용
- `any` 사용 금지 - 최소 `unknown` 사용

## Styling: MUI (Material UI v7)

```tsx
// sx prop 사용 (inline)
<Box sx={{ display: 'flex', gap: 2, p: 3 }}>

// 테마 색상 참조
sx={{ color: 'error.main' }}     // 빨간색 (상승)
sx={{ color: 'primary.main' }}   // 파란색 (하락)
```

- MUI `sx` prop 우선, CSS 파일 최소화
- Theme: primary=#1a1a2e, secondary=#e94560
- 반응형: MUI breakpoints (`{ xs: ..., md: ... }`)
- 폰트: Pretendard (한국어), Roboto (영문)

## Chart Libraries

| 라이브러리 | 용도 | 컴포넌트 |
|-----------|------|----------|
| lightweight-charts (TradingView) | 캔들스틱, 볼륨 | `CandlestickChart`, `VolumeChart` |
| Recharts | 파이차트, 바차트 | `PortfolioChart` |

### 차트 컬러 규칙 (한국 관례)
- 상승(up): 빨강 `#e94560`
- 하락(down): 파랑 `#185adb`

## Routing

```tsx
// routes.tsx - createBrowserRouter
/                           -> DashboardPage
/stock/:market/:ticker      -> StockDetailPage
/search?q=&market=          -> SearchPage
/portfolio                  -> PortfolioPage
/watchlist                  -> WatchlistPage
```

- React Router v7 (createBrowserRouter)
- Layout: App.tsx (Navbar + Outlet)

## Formatting Utils

```tsx
formatCurrency(value, currency?)  // $1,234.56 / 1,234원
formatPercent(value)              // +12.34% / -5.67%
formatNumber(value)               // 1,234,567
formatMarketCap(value)            // 1.5조 / 3,456억
```

## Dependencies
- React 19, React DOM 19
- react-router-dom 7, @tanstack/react-query 5
- @mui/material 7, @mui/icons-material 7
- axios 1.14, dayjs 1.11
- lightweight-charts 5, recharts 3
- zustand 5
- TypeScript 5.9, Vite 8

## UI Language
- 전체 UI 한국어 (버튼, 레이블, 메시지 모두 한국어)
- 티커/종목명은 원문 유지 (e.g., AAPL, 삼성전자)
