package com.stockplanner.service.external;

import com.fasterxml.jackson.databind.JsonNode;
import com.stockplanner.model.dto.NewsDto;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import jakarta.annotation.PostConstruct;
import java.net.URI;
import org.springframework.web.util.UriComponentsBuilder;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

@Component
@Slf4j
public class NaverNewsClient implements NewsApiClient {

    private static final DateTimeFormatter NAVER_FORMAT =
            DateTimeFormatter.ofPattern("EEE, dd MMM yyyy HH:mm:ss Z", Locale.ENGLISH);
    private static final DateTimeFormatter OUT_FORMAT =
            DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");

    private final RestTemplate restTemplate;
    private final String clientId;
    private final String clientSecret;
    private final String baseUrl;

    public NaverNewsClient(
            RestTemplate restTemplate,
            @Value("${stock-api.naver.client-id:}") String clientId,
            @Value("${stock-api.naver.client-secret:}") String clientSecret,
            @Value("${stock-api.naver.base-url:https://openapi.naver.com/v1/search}") String baseUrl) {
        this.restTemplate = restTemplate;
        this.clientId = clientId;
        this.clientSecret = clientSecret;
        this.baseUrl = baseUrl;
    }

    @PostConstruct
    private void init() {
        if (clientId.isBlank() || clientSecret.isBlank()) {
            log.warn("Naver API credentials not configured (stock-api.naver.client-id/client-secret). KR news fetch will be skipped.");
        }
    }

    @Override
    public String getSupportedMarket() {
        return "KR";
    }

    @Override
    @Cacheable(value = "krNews", key = "#keyword + '-' + #limit")
    public List<NewsDto> fetchNewsByKeyword(String keyword, int limit) {
        if (clientId.isBlank() || clientSecret.isBlank()) {
            log.debug("Naver API credentials not configured. Skipping KR news fetch.");
            return List.of();
        }
        URI url = UriComponentsBuilder.fromHttpUrl(baseUrl + "/news.json")
                .queryParam("query", keyword)
                .queryParam("display", Math.min(limit, 100))
                .queryParam("sort", "date")
                .build()
                .encode()
                .toUri();
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.set("X-Naver-Client-Id", clientId);
            headers.set("X-Naver-Client-Secret", clientSecret);
            HttpEntity<Void> entity = new HttpEntity<>(headers);

            ResponseEntity<JsonNode> response = restTemplate.exchange(
                    url, HttpMethod.GET, entity, JsonNode.class);

            if (response.getBody() == null || !response.getBody().has("items")) {
                return List.of();
            }
            List<NewsDto> results = new ArrayList<>();
            for (JsonNode item : response.getBody().get("items")) {
                results.add(NewsDto.builder()
                        .title(cleanHtml(getText(item, "title")))
                        .summary(cleanHtml(getText(item, "description")))
                        .url(getText(item, "link"))
                        .source(extractSource(getText(item, "originallink")))
                        .publishedAt(parseTime(getText(item, "pubDate")))
                        .sentiment("neutral")
                        .market("KR")
                        .build());
            }
            return results;
        } catch (Exception e) {
            log.error("Error fetching KR news for keyword {}: {}", keyword, e.getMessage());
            return List.of();
        }
    }

    private String getText(JsonNode node, String field) {
        return (node != null && node.has(field)) ? node.get(field).asText("") : "";
    }

    private String cleanHtml(String text) {
        if (text == null) return "";
        return text.replaceAll("<[^>]*>", "").replaceAll("&amp;", "&")
                .replaceAll("&lt;", "<").replaceAll("&gt;", ">")
                .replaceAll("&quot;", "\"").replaceAll("&#039;", "'");
    }

    private String extractSource(String url) {
        if (url == null || url.isEmpty()) return "";
        try {
            String host = java.net.URI.create(url).getHost();
            return host != null ? host.replaceFirst("^www\\.", "") : "";
        } catch (Exception e) {
            return "";
        }
    }

    private String parseTime(String raw) {
        if (raw == null || raw.isEmpty()) return "";
        try {
            return ZonedDateTime.parse(raw, NAVER_FORMAT).format(OUT_FORMAT);
        } catch (DateTimeParseException e) {
            return raw;
        }
    }
}
