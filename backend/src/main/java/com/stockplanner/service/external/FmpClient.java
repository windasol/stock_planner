package com.stockplanner.service.external;

import com.fasterxml.jackson.databind.JsonNode;
import com.stockplanner.model.dto.EconomicEventDto;
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
public class FmpClient {

    private static final String BASE_URL = "https://financialmodelingprep.com/stable";

    private final RestTemplate restTemplate;
    private final String apiKey;

    public FmpClient(
            RestTemplate restTemplate,
            @Value("${stock-api.fmp.api-key:}") String apiKey) {
        this.restTemplate = restTemplate;
        this.apiKey = apiKey;
    }

    @PostConstruct
    private void init() {
        if (apiKey.isBlank()) {
            log.warn("FMP API key not configured (stock-api.fmp.api-key). Economic calendar will return empty data.");
        } else {
            log.info("FmpClient initialized with api-key: {}***", apiKey.length() > 4 ? apiKey.substring(0, 4) : "????");
        }
    }

    /**
     * 글로벌 경제 캘린더 조회 (FMP)
     * from/to: yyyy-MM-dd
     * FMP 무료 플랜: 250 req/day, 1시간 캐싱으로 충분
     */
    @Cacheable(value = "economicCalendar", key = "#from + '-' + #to")
    public List<EconomicEventDto> fetchEconomicCalendar(String from, String to) {
        if (apiKey.isBlank()) return List.of();

        String url = String.format("%s/economic-calendar?from=%s&to=%s&apikey=%s", BASE_URL, from, to, apiKey);
        try {
            JsonNode res = restTemplate.getForObject(url, JsonNode.class);
            if (res == null || !res.isArray()) return List.of();

            List<EconomicEventDto> result = new ArrayList<>();
            for (JsonNode item : res) {
                String impact = text(item, "impact");
                result.add(EconomicEventDto.builder()
                        .date(text(item, "date"))
                        .time("")
                        .country(text(item, "country"))
                        .event(text(item, "event"))
                        .impact(impact.toLowerCase())   // FMP는 "High"/"Medium"/"Low" → 소문자로 통일
                        .unit("")
                        .actual(dbl(item, "actual"))
                        .estimate(dbl(item, "estimate"))
                        .previous(dbl(item, "previous"))
                        .build());
            }
            result.sort((a, b) -> a.getDate().compareTo(b.getDate()));
            log.info("Fetched {} economic events from FMP ({} ~ {})", result.size(), from, to);
            return result;
        } catch (Exception e) {
            log.error("Error fetching economic calendar from FMP: {}", e.getMessage());
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
}
