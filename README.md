# Stock Planner - 주식 투자 플래너

미국(NYSE/NASDAQ) & 한국(코스피/코스닥) 주식 투자를 위한 웹 애플리케이션

## 기술 스택

- **Backend**: Java 17 / Spring Boot 3.2 / PostgreSQL
- **Frontend**: React 18 / TypeScript / Vite / Material UI
- **차트**: TradingView lightweight-charts / Recharts
- **외부 API**: Alpha Vantage (US) / 한국투자증권 OpenAPI (KR)

## 실행 방법

### 1. PostgreSQL 실행
```bash
docker-compose up -d
```

### 2. Backend 실행
```bash
cd backend
./mvnw spring-boot:run
```

### 3. Frontend 실행
```bash
cd frontend
npm install
npm run dev
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:8080/api
- Swagger UI: http://localhost:8080/swagger-ui.html

## 환경 변수

| 변수 | 설명 | 기본값 |
|---|---|---|
| DB_PASSWORD | PostgreSQL 비밀번호 | stockplanner123 |
| ALPHA_VANTAGE_API_KEY | Alpha Vantage API 키 | demo |
| KIS_APP_KEY | 한국투자증권 앱 키 | - |
| KIS_APP_SECRET | 한국투자증권 앱 시크릿 | - |
