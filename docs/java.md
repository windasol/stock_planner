# Backend Convention - Java / Spring Boot

## Architecture: Layered + DDD-Lite

```
Controller (Presentation Layer)
    ↓ DTO
Service (Application/Domain Layer)
    ↓ Entity
Repository (Infrastructure Layer)
    ↓
Database (PostgreSQL)
```

### Layer 책임

| Layer | 패키지 | 책임 | 의존 방향 |
|-------|--------|------|-----------|
| **Controller** | `controller/` | HTTP 요청/응답, 입력 검증, DTO 변환 | -> Service |
| **Service** | `service/` | 비즈니스 로직, 트랜잭션 관리, 캐싱 | -> Repository, External |
| **Repository** | `repository/` | 데이터 접근, JPQL/Native Query | -> Entity |
| **Entity** | `model/entity/` | 도메인 모델, DB 매핑 | 독립 |
| **DTO** | `model/dto/` | 계층 간 데이터 전달 객체 | 독립 |
| **External** | `service/external/` | 외부 API 통신 (Alpha Vantage, KIS) | -> DTO |

### DDD 적용 원칙
- Entity는 JPA 매핑 + 도메인 행위 포함 가능 (e.g., `@PrePersist` timestamp)
- Service는 도메인 로직 조합 (여러 Repository/External 조합)
- Controller는 얇게 유지 - 로직 넣지 않음
- DTO ↔ Entity 변환은 Service 또는 MapStruct에서 수행

## Naming Convention

| 대상 | 규칙 | 예시 |
|------|------|------|
| Entity | 단수 명사, PascalCase | `Stock`, `Portfolio`, `PortfolioHolding` |
| Table | 복수 snake_case | `stocks`, `portfolio_holdings` |
| Repository | `{Entity}Repository` | `StockRepository` |
| Service | `{Domain}Service` | `StockService`, `ChartService` |
| Controller | `{Domain}Controller` | `StockController` |
| DTO | `{Name}Dto` / `{Name}Request` | `StockDto`, `AddHoldingRequest` |
| Enum | PascalCase, 값은 UPPER_SNAKE | `Market.US`, `ChartInterval.ONE_DAY` |

## Entity 규칙

```java
@Entity
@Table(name = "table_name")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class EntityName {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    // 필드 순서: id -> 비즈니스 키 -> 일반 필드 -> 관계 -> 타임스탬프
}
```

- Lombok: `@Getter`, `@Setter`, `@NoArgsConstructor`, `@AllArgsConstructor`, `@Builder`
- `@Enumerated(EnumType.STRING)` 사용 (ORDINAL 금지)
- 관계: `@ManyToOne(fetch = FetchType.LAZY)` 기본, `@OneToMany(cascade, orphanRemoval)`
- 복합 유니크: `@Table(uniqueConstraints = @UniqueConstraint(...))`

## Controller 규칙

```java
@RestController
@RequestMapping("/api/{domain}")
@RequiredArgsConstructor
public class DomainController {
    private final DomainService domainService;
    // GET /api/domain       -> 목록 조회
    // GET /api/domain/{id}  -> 단건 조회
    // POST /api/domain      -> 생성
    // PUT /api/domain/{id}  -> 수정
    // DELETE /api/domain/{id} -> 삭제
}
```

- REST 규칙 준수: 리소스 중심 URL, HTTP 메서드로 행위 표현
- `@RequiredArgsConstructor` + `private final` 필드 주입
- 응답: 200 (조회), 201 (생성 - `ResponseEntity.created()`), 204 (삭제)
- Request DTO에 `@Valid` + Bean Validation 적용

## Service 규칙

```java
@Service
@RequiredArgsConstructor
@Slf4j
public class DomainService {
    private final DomainRepository repository;
    
    @Transactional(readOnly = true)  // 조회
    @Transactional                    // 변경
    @Cacheable("cacheName")          // 캐싱
}
```

- 조회 메서드: `@Transactional(readOnly = true)`
- 변경 메서드: `@Transactional`
- 외부 API 캐싱: `@Cacheable` (Caffeine, 5분 TTL)
- 예외: 커스텀 Exception throw -> `GlobalExceptionHandler`에서 처리

## Repository 규칙

```java
public interface DomainRepository extends JpaRepository<Entity, Long> {
    Optional<Entity> findByFieldAndField(Type val1, Type val2);
    
    @Query("SELECT e FROM Entity e WHERE ...")
    List<Entity> customSearch(@Param("q") String query);
}
```

- Spring Data JPA 메서드 네이밍 쿼리 우선
- 복잡한 쿼리: `@Query` JPQL 사용
- 페이징: `Pageable` 파라미터 (필요시)

## Exception Handling

```
GlobalExceptionHandler (@RestControllerAdvice)
├── StockNotFoundException -> 404
├── ExternalApiException   -> 502
├── MethodArgumentNotValid -> 400
└── General Exception      -> 500
```

## Dependencies (pom.xml)
- Spring Boot 3.2.5, Java 17, Maven
- spring-boot-starter-web, data-jpa, validation, cache
- PostgreSQL (runtime), Caffeine (cache)
- Lombok, MapStruct 1.5.5
- springdoc-openapi 2.5.0
- H2 (test scope)

## External API Pattern

```java
// Interface
public interface StockApiClient {
    StockDto fetchQuote(String ticker);
    List<ChartDataDto> fetchDailyPrices(String ticker, LocalDate from, LocalDate to);
    List<SearchResultDto> searchStocks(String query);
}

// Market별 구현체: AlphaVantageClient (US), KisClient (KR)
// Service에서 Market enum으로 분기
```

## Config
- CORS: localhost:5173 허용 (WebConfig)
- Cache: Caffeine (maximumSize=500, expireAfterWrite=300s)
- DB: PostgreSQL (ddl-auto: update)
- Swagger: /swagger-ui.html
