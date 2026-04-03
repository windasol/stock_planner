package com.stockplanner.service.external;

import com.fasterxml.jackson.databind.JsonNode;
import com.stockplanner.model.dto.StockEventDto;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;

@Component
@Slf4j
public class FinnhubClient {

    private static final String BASE_URL = "https://finnhub.io/api/v1";

    private final RestTemplate restTemplate;
    private final String apiKey;

    public FinnhubClient(
            RestTemplate restTemplate,
            @Value("${stock-api.finnhub.api-key:}") String apiKey) {
        this.restTemplate = restTemplate;
        this.apiKey = apiKey;
    }

    @PostConstruct
    private void init() {
        if (apiKey.isBlank()) {
            log.warn("Finnhub API key not configured (stock-api.finnhub.api-key). Calendar features will return empty data.");
        } else {
            log.info("FinnhubClient initialized with api-key: {}***", apiKey.length() > 4 ? apiKey.substring(0, 4) : "????");
        }
    }

    /**
     * 종목별 실적 발표 일정 조회
     * symbol: 티커 (예: AAPL), from/to: yyyy-MM-dd
     */
    @Cacheable(value = "earningsCalendar", key = "#symbol + '-' + #from + '-' + #to")
    public List<StockEventDto> fetchEarningsCalendar(String symbol, String from, String to) {
        if (apiKey.isBlank()) return List.of();

        String url = String.format("%s/calendar/earnings?symbol=%s&from=%s&to=%s&token=%s",
                BASE_URL, symbol, from, to, apiKey);
        try {
            JsonNode res = restTemplate.getForObject(url, JsonNode.class);
            if (res == null || !res.has("earningsCalendar")) return List.of();

            List<StockEventDto> result = new ArrayList<>();
            for (JsonNode item : res.get("earningsCalendar")) {
                String hour = text(item, "hour");
                String hourLabel = switch (hour) {
                    case "bmo" -> "장 시작 전";
                    case "amc" -> "장 마감 후";
                    case "dmh" -> "장 중";
                    default -> "";
                };
                String quarter = text(item, "quarter");
                String year    = text(item, "year");
                String desc = String.format("%sQ%s 실적 발표%s",
                        year, quarter, hourLabel.isEmpty() ? "" : " (" + hourLabel + ")");

                result.add(StockEventDto.builder()
                        .date(text(item, "date"))
                        .type("EARNINGS")
                        .description(desc)
                        .epsEstimate(dbl(item, "epsEstimate"))
                        .epsActual(dbl(item, "epsActual"))
                        .revenueEstimate(lng(item, "revenueEstimate"))
                        .revenueActual(lng(item, "revenueActual"))
                        .hour(hour)
                        .quarter(item.has("quarter") && !item.get("quarter").isNull() ? item.get("quarter").asInt() : null)
                        .year(item.has("year") && !item.get("year").isNull() ? item.get("year").asInt() : null)
                        .build());
            }
            result.sort((a, b) -> a.getDate().compareTo(b.getDate()));
            log.info("Fetched {} earnings events for {}", result.size(), symbol);
            return result;
        } catch (Exception e) {
            log.error("Error fetching earnings calendar for {}: {}", symbol, e.getMessage());
            return List.of();
        }
    }

    /**
     * 종목별 배당 일정 조회
     */
    @Cacheable(value = "dividendCalendar", key = "#symbol + '-' + #from + '-' + #to")
    public List<StockEventDto> fetchDividendCalendar(String symbol, String from, String to) {
        if (apiKey.isBlank()) return List.of();

        String url = String.format("%s/stock/dividend?symbol=%s&from=%s&to=%s&token=%s",
                BASE_URL, symbol, from, to, apiKey);
        try {
            JsonNode res = restTemplate.getForObject(url, JsonNode.class);
            if (res == null || !res.isArray()) return List.of();

            List<StockEventDto> result = new ArrayList<>();
            for (JsonNode item : res) {
                Double amount = dbl(item, "amount");
                String currency = text(item, "currency");
                String desc = String.format("배당 기준일 (%.4f %s)", amount != null ? amount : 0, currency);

                result.add(StockEventDto.builder()
                        .date(text(item, "date"))
                        .type("DIVIDEND")
                        .description(desc)
                        .dividendAmount(amount)
                        .payDate(text(item, "payDate"))
                        .recordDate(text(item, "recordDate"))
                        .currency(currency)
                        .build());
            }
            result.sort((a, b) -> a.getDate().compareTo(b.getDate()));
            log.info("Fetched {} dividend events for {}", result.size(), symbol);
            return result;
        } catch (Exception e) {
            log.error("Error fetching dividend calendar for {}: {}", symbol, e.getMessage());
            return List.of();
        }
    }

    /**
     * 종목별 주식분할 일정 조회
     */
    @Cacheable(value = "splitCalendar", key = "#symbol + '-' + #from + '-' + #to")
    public List<StockEventDto> fetchSplitCalendar(String symbol, String from, String to) {
        if (apiKey.isBlank()) return List.of();

        String url = String.format("%s/stock/split?symbol=%s&from=%s&to=%s&token=%s",
                BASE_URL, symbol, from, to, apiKey);
        try {
            JsonNode res = restTemplate.getForObject(url, JsonNode.class);
            if (res == null || !res.isArray()) return List.of();

            List<StockEventDto> result = new ArrayList<>();
            for (JsonNode item : res) {
                Double from2 = dbl(item, "fromFactor");
                Double to2   = dbl(item, "toFactor");
                String desc = String.format("주식분할 (%.0f:%.0f)", from2 != null ? from2 : 0, to2 != null ? to2 : 0);

                result.add(StockEventDto.builder()
                        .date(text(item, "date"))
                        .type("SPLIT")
                        .description(desc)
                        .fromFactor(from2)
                        .toFactor(to2)
                        .build());
            }
            result.sort((a, b) -> a.getDate().compareTo(b.getDate()));
            log.info("Fetched {} split events for {}", result.size(), symbol);
            return result;
        } catch (Exception e) {
            log.error("Error fetching split calendar for {}: {}", symbol, e.getMessage());
            return List.of();
        }
    }

    private String text(JsonNode node, String field) {
        return node != null && node.has(field) && !node.get(field).isNull()
                ? node.get(field).asText() : "";
    }

    private Double dbl(JsonNode node, String field) {
        if (node == null || !node.has(field) || node.get(field).isNull()) return null;
        try { return Double.parseDouble(node.get(field).asText()); }
        catch (NumberFormatException e) { return null; }
    }

    private Long lng(JsonNode node, String field) {
        if (node == null || !node.has(field) || node.get(field).isNull()) return null;
        try { return Long.parseLong(node.get(field).asText()); }
        catch (NumberFormatException e) { return null; }
    }
}
