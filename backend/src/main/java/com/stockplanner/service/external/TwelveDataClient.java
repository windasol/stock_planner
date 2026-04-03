package com.stockplanner.service.external;

import com.fasterxml.jackson.databind.JsonNode;
import com.stockplanner.model.dto.ChartDataDto;
import com.stockplanner.model.dto.StockDto;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;

@Component
@Slf4j
public class TwelveDataClient {

    private final RestTemplate restTemplate;
    private final String apiKey;
    private final String baseUrl;

    public TwelveDataClient(
            RestTemplate restTemplate,
            @Value("${stock-api.twelvedata.api-key}") String apiKey,
            @Value("${stock-api.twelvedata.base-url:https://api.twelvedata.com}") String baseUrl) {
        this.restTemplate = restTemplate;
        this.apiKey = apiKey;
        this.baseUrl = baseUrl;
        log.info("TwelveDataClient initialized with api-key: {}***", apiKey.length() > 4 ? apiKey.substring(0, 4) : "????");
    }

    /**
     * 종목 현재가 조회
     * market: "US" 또는 "KR"
     * KR 종목은 symbol을 "005930:KRX" 형식으로 변환
     */
    @Cacheable(value = "quotes", key = "#market + '-' + #ticker")
    public StockDto fetchQuote(String ticker, String market) {
        String symbol = toSymbol(ticker, market);
        String url = String.format("%s/quote?symbol=%s&apikey=%s", baseUrl, symbol, apiKey);
        try {
            JsonNode res = restTemplate.getForObject(url, JsonNode.class);
            if (res == null || res.has("code")) {
                log.warn("TwelveData quote error for {}: {}", symbol, res);
                return stubQuote(ticker, market);
            }
            return StockDto.builder()
                    .ticker(ticker)
                    .name(text(res, "name", ticker))
                    .market(market)
                    .currency("KR".equals(market) ? "KRW" : "USD")
                    .exchange(text(res, "exchange", ""))
                    .price(dbl(res, "close"))
                    .changePercent(dbl(res, "percent_change"))
                    .build();
        } catch (Exception e) {
            log.error("Error fetching quote for {}: {}", symbol, e.getMessage());
            return stubQuote(ticker, market);
        }
    }

    private StockDto stubQuote(String ticker, String market) {
        return StockDto.builder()
                .ticker(ticker)
                .name(ticker)
                .market(market)
                .currency("KR".equals(market) ? "KRW" : "USD")
                .exchange("")
                .price(0)
                .changePercent(0)
                .build();
    }

    /**
     * 차트 데이터 조회
     * interval: 프론트 값 (1D, 1W, 1M, 3M, 1Y, ALL) → Twelve Data interval로 변환
     */
    @Cacheable(value = "timeSeries", key = "#market + '-' + #ticker + '-' + #interval + '-' + #from + '-' + #to")
    public List<ChartDataDto> fetchTimeSeries(String ticker, String market, String interval, String from, String to) {
        String symbol = toSymbol(ticker, market);
        String tdInterval = toTwelveDataInterval(interval);
        int outputSize = toOutputSize(interval);

        StringBuilder url = new StringBuilder(String.format(
                "%s/time_series?symbol=%s&interval=%s&outputsize=%d&apikey=%s",
                baseUrl, symbol, tdInterval, outputSize, apiKey));
        if (from != null) url.append("&start_date=").append(from);
        if (to != null) url.append("&end_date=").append(to);

        try {
            JsonNode res = restTemplate.getForObject(url.toString(), JsonNode.class);
            if (res == null || res.has("code") || !res.has("values")) {
                log.warn("TwelveData time_series error for {}: {}", symbol, res);
                return List.of();
            }
            List<ChartDataDto> result = new ArrayList<>();
            for (JsonNode v : res.get("values")) {
                result.add(ChartDataDto.builder()
                        .time(text(v, "datetime", ""))
                        .open(dbl(v, "open"))
                        .high(dbl(v, "high"))
                        .low(dbl(v, "low"))
                        .close(dbl(v, "close"))
                        .volume(lng(v, "volume"))
                        .build());
            }
            // Twelve Data는 최신순으로 내려줌 → 오름차순 정렬
            result.sort((a, b) -> a.getTime().compareTo(b.getTime()));
            return result;
        } catch (Exception e) {
            log.error("Error fetching time series for {}: {}", symbol, e.getMessage());
            return List.of();
        }
    }

    /**
     * 종목 검색
     */
    @Cacheable(value = "search", key = "#query + '-' + #market")
    public List<StockDto> searchStocks(String query, String market) {
        String url = String.format("%s/symbol_search?symbol=%s&apikey=%s", baseUrl, query, apiKey);
        try {
            JsonNode res = restTemplate.getForObject(url, JsonNode.class);
            if (res == null || !res.has("data")) return List.of();

            List<StockDto> results = new ArrayList<>();
            for (JsonNode item : res.get("data")) {
                String country = text(item, "country", "");
                String type = text(item, "instrument_type", "");

                // 주식(Common Stock, ETF)만 필터링
                if (!type.contains("Common Stock") && !type.contains("ETF")) continue;

                // 마켓 필터
                boolean isKR = "South Korea".equals(country);
                boolean isUS = "United States".equals(country);
                if ("KR".equals(market) && !isKR) continue;
                if ("US".equals(market) && !isUS) continue;
                if (market == null || market.isEmpty()) {
                    if (!isUS && !isKR) continue;
                }

                results.add(StockDto.builder()
                        .ticker(text(item, "symbol", ""))
                        .name(text(item, "instrument_name", ""))
                        .market(isKR ? "KR" : "US")
                        .exchange(text(item, "exchange", ""))
                        .currency(isKR ? "KRW" : "USD")
                        .build());
            }
            return results;
        } catch (Exception e) {
            log.error("Error searching stocks for {}: {}", query, e.getMessage());
            return List.of();
        }
    }

    /** KR 종목은 "005930:KRX" 형식으로 변환 */
    private String toSymbol(String ticker, String market) {
        if ("KR".equals(market)) return ticker + ":KRX";
        return ticker;
    }

    /** 프론트 interval → Twelve Data interval */
    private String toTwelveDataInterval(String interval) {
        return switch (interval) {
            case "1D" -> "5min";
            case "1W" -> "1h";
            case "1M", "3M" -> "1day";
            case "1Y", "ALL" -> "1week";
            default -> "1day";
        };
    }

    /** interval에 따른 데이터 포인트 수 */
    private int toOutputSize(String interval) {
        return switch (interval) {
            case "1D" -> 78;    // 하루 5분봉 (6.5시간 × 12)
            case "1W" -> 168;   // 1주 1시간봉
            case "1M" -> 30;
            case "3M" -> 90;
            case "1Y" -> 52;
            case "ALL" -> 500;
            default -> 90;
        };
    }

    private String text(JsonNode node, String field, String def) {
        return node != null && node.has(field) && !node.get(field).isNull()
                ? node.get(field).asText() : def;
    }

    private double dbl(JsonNode node, String field) {
        if (node == null || !node.has(field) || node.get(field).isNull()) return 0;
        try { return Double.parseDouble(node.get(field).asText()); }
        catch (NumberFormatException e) { return 0; }
    }

    private long lng(JsonNode node, String field) {
        if (node == null || !node.has(field) || node.get(field).isNull()) return 0;
        try { return Long.parseLong(node.get(field).asText()); }
        catch (NumberFormatException e) { return 0; }
    }
}
