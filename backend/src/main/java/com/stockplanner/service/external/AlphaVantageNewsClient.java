package com.stockplanner.service.external;

import com.fasterxml.jackson.databind.JsonNode;
import com.stockplanner.exception.ExternalApiException;
import com.stockplanner.model.dto.NewsDto;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.List;

@Component
@Slf4j
public class AlphaVantageNewsClient implements NewsApiClient {

    private static final DateTimeFormatter AV_FORMAT = DateTimeFormatter.ofPattern("yyyyMMdd'T'HHmmss");
    private static final DateTimeFormatter OUT_FORMAT = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");

    private final RestTemplate restTemplate;
    private final String apiKey;
    private final String baseUrl;

    public AlphaVantageNewsClient(
            RestTemplate restTemplate,
            @Value("${stock-api.alphavantage.api-key}") String apiKey,
            @Value("${stock-api.alphavantage.base-url}") String baseUrl) {
        this.restTemplate = restTemplate;
        this.apiKey = apiKey;
        this.baseUrl = baseUrl;
    }

    @Override
    public String getSupportedMarket() {
        return "US";
    }

    @Override
    @Cacheable(value = "usNews", key = "#keyword + '-' + #limit")
    public List<NewsDto> fetchNewsByKeyword(String keyword, int limit) {
        // tickers 파라미터로 ticker 검색, topics로 글로벌 이슈 검색 모두 지원
        String url = String.format(
                "%s?function=NEWS_SENTIMENT&tickers=%s&limit=%d&sort=LATEST&apikey=%s",
                baseUrl, keyword, limit, apiKey);
        try {
            JsonNode response = restTemplate.getForObject(url, JsonNode.class);
            if (response == null || !response.has("feed")) {
                log.warn("No news feed returned for keyword: {}", keyword);
                return List.of();
            }
            List<NewsDto> results = new ArrayList<>();
            for (JsonNode item : response.get("feed")) {
                results.add(NewsDto.builder()
                        .title(getText(item, "title"))
                        .summary(getText(item, "summary"))
                        .url(getText(item, "url"))
                        .source(getText(item, "source"))
                        .publishedAt(parseTime(getText(item, "time_published")))
                        .sentiment(getText(item, "overall_sentiment_label"))
                        .sentimentScore(getDouble(item, "overall_sentiment_score"))
                        .market("US")
                        .build());
            }
            return results;
        } catch (ExternalApiException e) {
            throw e;
        } catch (Exception e) {
            log.error("Error fetching US news for keyword {}: {}", keyword, e.getMessage());
            return List.of();
        }
    }

    private String getText(JsonNode node, String field) {
        return (node != null && node.has(field)) ? node.get(field).asText("") : "";
    }

    private Double getDouble(JsonNode node, String field) {
        if (node == null || !node.has(field)) return null;
        try {
            return node.get(field).asDouble();
        } catch (Exception e) {
            return null;
        }
    }

    private String parseTime(String raw) {
        if (raw == null || raw.isEmpty()) return "";
        try {
            return LocalDateTime.parse(raw, AV_FORMAT).format(OUT_FORMAT);
        } catch (DateTimeParseException e) {
            return raw;
        }
    }
}
