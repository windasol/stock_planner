package com.stockplanner.service.external;

import com.fasterxml.jackson.databind.JsonNode;
import com.stockplanner.exception.ExternalApiException;
import com.stockplanner.model.dto.ChartDataDto;
import com.stockplanner.model.dto.StockDto;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.time.Instant;
import java.util.*;

/**
 * 한국투자증권 OpenAPI 클라이언트.
 *
 * 인증: OAuth2 client_credentials (POST /oauth2/tokenP) → Bearer 토큰 (24시간)
 *
 * 지원 기능:
 *   - 종목 현재가 조회: FHKST01010100
 *   - 일자별 시세:      FHKST01010400
 *   - 종목 코드 검색:   CTPF1702R (종목코드 4~6자리 숫자 입력 시)
 *
 * 주의: KIS OpenAPI는 종목명 텍스트 검색을 지원하지 않습니다.
 *       종목코드(숫자)로 입력된 경우에만 API를 호출하며,
 *       한글/영문 검색어는 빈 결과를 반환합니다 (DB 캐시 검색으로 대체).
 *
 * 환경 변수:
 *   KIS_APP_KEY    - 한국투자증권 앱키
 *   KIS_APP_SECRET - 한국투자증권 앱시크릿
 *
 * base-url:
 *   실전: https://openapi.koreainvestment.com:9443
 *   모의: https://openapivts.koreainvestment.com:29443
 */
@Component
@Slf4j
public class KisClient implements StockApiClient {

    private final RestTemplate restTemplate;
    private final String appKey;
    private final String appSecret;
    private final String baseUrl;

    /** 메모리 내 토큰 캐시 (만료 5분 전에 재발급) */
    private String accessToken;
    private Instant tokenExpiry;

    public KisClient(
            RestTemplate restTemplate,
            @Value("${stock-api.kis.app-key}") String appKey,
            @Value("${stock-api.kis.app-secret}") String appSecret,
            @Value("${stock-api.kis.base-url}") String baseUrl) {
        this.restTemplate = restTemplate;
        this.appKey = appKey;
        this.appSecret = appSecret;
        this.baseUrl = baseUrl;
    }

    // ─────────────────────────────────────────────────────────
    // StockApiClient 구현
    // ─────────────────────────────────────────────────────────

    @Override
    @Cacheable(value = "krQuotes", key = "#ticker")
    public StockDto fetchQuote(String ticker) {
        String url = baseUrl + "/uapi/domestic-stock/v1/quotations/inquire-price"
                + "?FID_COND_MRKT_DIV_CODE=J&FID_INPUT_ISCD=" + ticker;
        try {
            HttpEntity<Void> request = new HttpEntity<>(buildAuthHeaders("FHKST01010100"));
            ResponseEntity<JsonNode> response = restTemplate.exchange(url, HttpMethod.GET, request, JsonNode.class);

            JsonNode body = response.getBody();
            if (body == null || !body.has("output")) {
                throw new ExternalApiException("KIS API: 응답에 output 없음 (ticker=" + ticker + ")");
            }
            JsonNode output = body.get("output");

            return StockDto.builder()
                    .ticker(ticker)
                    .name(output.path("hts_kor_isnm").asText(ticker))
                    .market("KR")
                    .currency("KRW")
                    .price(parseDouble(output, "stck_prpr"))
                    .changePercent(parseDouble(output, "prdy_ctrt"))
                    .build();
        } catch (ExternalApiException e) {
            throw e;
        } catch (Exception e) {
            log.error("KIS 현재가 조회 실패 (ticker={}): {}", ticker, e.getMessage());
            throw new ExternalApiException("KIS 현재가 조회 실패: " + ticker, e);
        }
    }

    @Override
    @Cacheable(value = "krDailyPrices", key = "#ticker + '-' + #from + '-' + #to")
    public List<ChartDataDto> fetchDailyPrices(String ticker, String from, String to) {
        String url = baseUrl + "/uapi/domestic-stock/v1/quotations/inquire-daily-price"
                + "?FID_COND_MRKT_DIV_CODE=J&FID_INPUT_ISCD=" + ticker
                + "&FID_PERIOD_DIV_CODE=D&FID_ORG_ADJ_PRC=0";
        try {
            HttpEntity<Void> request = new HttpEntity<>(buildAuthHeaders("FHKST01010400"));
            ResponseEntity<JsonNode> response = restTemplate.exchange(url, HttpMethod.GET, request, JsonNode.class);

            JsonNode body = response.getBody();
            if (body == null || !body.has("output2")) {
                return List.of();
            }

            List<ChartDataDto> result = new ArrayList<>();
            for (JsonNode day : body.get("output2")) {
                String date = kisDateToIso(day.path("stck_bsop_date").asText());
                if ((from == null || date.compareTo(from) >= 0) &&
                        (to == null || date.compareTo(to) <= 0)) {
                    result.add(ChartDataDto.builder()
                            .time(date)
                            .open(parseDouble(day, "stck_oprc"))
                            .high(parseDouble(day, "stck_hgpr"))
                            .low(parseDouble(day, "stck_lwpr"))
                            .close(parseDouble(day, "stck_clpr"))
                            .volume(parseLong(day, "acml_vol"))
                            .build());
                }
            }
            result.sort(Comparator.comparing(ChartDataDto::getTime));
            return result;
        } catch (ExternalApiException e) {
            throw e;
        } catch (Exception e) {
            log.error("KIS 일자별 시세 조회 실패 (ticker={}): {}", ticker, e.getMessage());
            throw new ExternalApiException("KIS 일자별 시세 조회 실패: " + ticker, e);
        }
    }

    /**
     * 종목 검색.
     * KIS OpenAPI는 종목코드(숫자) 기반 조회만 지원합니다.
     * 입력값이 4~6자리 숫자인 경우에만 API를 호출하며, 나머지는 빈 리스트를 반환합니다.
     */
    @Override
    @Cacheable(value = "krSearch", key = "#query")
    public List<StockDto> searchStocks(String query) {
        if (!query.matches("\\d{4,6}")) {
            log.debug("KIS 검색은 종목코드(숫자)만 지원합니다. query={}", query);
            return List.of();
        }

        String url = baseUrl + "/uapi/domestic-stock/v1/quotations/search-stock-info"
                + "?PRDT_TYPE_CD=300&PDNO=" + query;
        try {
            HttpEntity<Void> request = new HttpEntity<>(buildAuthHeaders("CTPF1702R"));
            ResponseEntity<JsonNode> response = restTemplate.exchange(url, HttpMethod.GET, request, JsonNode.class);

            JsonNode body = response.getBody();
            if (body == null || !body.has("output")) {
                return List.of();
            }
            JsonNode output = body.get("output");
            String name = output.path("prdt_abrv_name").asText("").trim();
            if (name.isEmpty()) {
                return List.of();
            }

            return List.of(StockDto.builder()
                    .ticker(query)
                    .name(name)
                    .market("KR")
                    .currency("KRW")
                    .exchange("KRX")
                    .build());
        } catch (Exception e) {
            log.error("KIS 종목 검색 실패 (query={}): {}", query, e.getMessage());
            return List.of();
        }
    }

    // ─────────────────────────────────────────────────────────
    // 토큰 관리
    // ─────────────────────────────────────────────────────────

    private synchronized String getAccessToken() {
        if (accessToken != null && tokenExpiry != null
                && Instant.now().isBefore(tokenExpiry.minusSeconds(300))) {
            return accessToken;
        }

        String url = baseUrl + "/oauth2/tokenP";
        Map<String, String> body = new HashMap<>();
        body.put("grant_type", "client_credentials");
        body.put("appkey", appKey);
        body.put("appsecret", appSecret);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, String>> request = new HttpEntity<>(body, headers);

        try {
            JsonNode response = restTemplate.postForObject(url, request, JsonNode.class);
            if (response == null || !response.has("access_token")) {
                throw new ExternalApiException("KIS 토큰 발급 실패: 응답에 access_token 없음");
            }
            accessToken = response.get("access_token").asText();
            long expiresIn = response.has("expires_in") ? response.get("expires_in").asLong() : 86400L;
            tokenExpiry = Instant.now().plusSeconds(expiresIn);
            log.info("KIS access token 발급 완료 (만료까지 {}초)", expiresIn);
            return accessToken;
        } catch (ExternalApiException e) {
            throw e;
        } catch (Exception e) {
            throw new ExternalApiException("KIS 토큰 발급 실패", e);
        }
    }

    private HttpHeaders buildAuthHeaders(String trId) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("authorization", "Bearer " + getAccessToken());
        headers.set("appkey", appKey);
        headers.set("appsecret", appSecret);
        headers.set("tr_id", trId);
        return headers;
    }

    // ─────────────────────────────────────────────────────────
    // 유틸
    // ─────────────────────────────────────────────────────────

    /** KIS 날짜 형식 "20240103" → ISO "2024-01-03" */
    private String kisDateToIso(String yyyymmdd) {
        if (yyyymmdd == null || yyyymmdd.length() != 8) return yyyymmdd;
        return yyyymmdd.substring(0, 4) + "-" + yyyymmdd.substring(4, 6) + "-" + yyyymmdd.substring(6, 8);
    }

    private double parseDouble(JsonNode node, String field) {
        if (node == null || !node.has(field)) return 0;
        try {
            return Double.parseDouble(node.get(field).asText().replace(",", ""));
        } catch (NumberFormatException e) {
            return 0;
        }
    }

    private long parseLong(JsonNode node, String field) {
        if (node == null || !node.has(field)) return 0;
        try {
            return Long.parseLong(node.get(field).asText().replace(",", ""));
        } catch (NumberFormatException e) {
            return 0;
        }
    }
}
