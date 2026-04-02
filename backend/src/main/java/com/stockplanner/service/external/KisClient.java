package com.stockplanner.service.external;

import com.stockplanner.model.dto.ChartDataDto;
import com.stockplanner.model.dto.StockDto;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.List;

/**
 * 한국투자증권 OpenAPI 클라이언트.
 * 실제 API 연동은 KIS OpenAPI 키 발급 후 구현합니다.
 * 현재는 Stub으로 기본 구조만 제공합니다.
 */
@Component
@Slf4j
public class KisClient implements StockApiClient {

    private final RestTemplate restTemplate;
    private final String appKey;
    private final String appSecret;
    private final String baseUrl;

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

    @Override
    @Cacheable(value = "krQuotes", key = "#ticker")
    public StockDto fetchQuote(String ticker) {
        // TODO: 한국투자증권 OpenAPI 연동 - 주식현재가 시세 API
        // GET /uapi/domestic-stock/v1/quotations/inquire-price
        log.warn("KIS API not yet configured. Returning stub data for {}", ticker);
        return StockDto.builder()
                .ticker(ticker)
                .name(ticker + " (KR)")
                .market("KR")
                .currency("KRW")
                .price(0)
                .changePercent(0)
                .build();
    }

    @Override
    @Cacheable(value = "krDailyPrices", key = "#ticker + '-' + #from + '-' + #to")
    public List<ChartDataDto> fetchDailyPrices(String ticker, String from, String to) {
        // TODO: 한국투자증권 OpenAPI 연동 - 주식현재가 일자별 API
        // GET /uapi/domestic-stock/v1/quotations/inquire-daily-price
        log.warn("KIS API not yet configured. Returning empty data for {}", ticker);
        return List.of();
    }

    @Override
    @Cacheable(value = "krSearch", key = "#query")
    public List<StockDto> searchStocks(String query) {
        // TODO: 한국투자증권 종목 검색 구현
        log.warn("KIS search not yet implemented for query: {}", query);
        return List.of();
    }
}
