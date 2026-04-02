# Stock Planner

주식 투자 플래너 웹 앱 (미국 + 한국 시장, 인증 없음)

## Stack

| Layer | Tech |
|-------|------|
| Backend | Spring Boot 3.2.5 / Java 17 / Maven / PostgreSQL 16 |
| Frontend | React 19 + TypeScript / Vite 8 / MUI 7 / TanStack Query 5 |
| Infra | Docker Compose (PostgreSQL) |

## Quick Start

```bash
docker-compose up -d                  # DB (port 5432)
cd backend && mvn spring-boot:run      # API (port 8080)
cd frontend && npm run dev            # UI (port 5173)
```

## RULES — 반드시 준수

### 파일 읽기 전
1. `frontend/src/` 또는 `backend/src/` 파일을 읽기 **전에** 반드시 해당 code-map을 먼저 읽는다.
   - Frontend → [docs/code-map-frontend.md](docs/code-map-frontend.md)
   - Backend → [docs/code-map-backend.md](docs/code-map-backend.md)
2. code-map에서 파일 경로·줄 번호를 확인한 뒤 `offset`/`limit`으로 필요한 범위만 읽는다.

### 소스 파일 수정 후
수정된 파일에 export명·줄번호 변경이 생겼으면 **같은 응답 안에서** 해당 code-map 항목을 즉시 업데이트한다.

## Docs

- [Code Map Index](docs/code-map.md) → [Frontend](docs/code-map-frontend.md) / [Backend](docs/code-map-backend.md)
- [API Endpoints & Caching](docs/api.md)
- [Implementation Status & Structure](docs/status.md)
- [Backend Conventions](docs/java.md)
- [Frontend Conventions](docs/front.md)

## Key Conventions

- UI 전체 한국어
- 차트 색상: 빨강=상승, 파랑=하락 (한국 관례)
- Currency: USD (`$`) / KRW (`원`, 조/억 단위)
- Market enum: `US` | `KR`
