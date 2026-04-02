package com.stockplanner.service.external;

import com.fasterxml.jackson.databind.JsonNode;
import com.stockplanner.exception.ExternalApiException;
import com.stockplanner.model.dto.ChartDataDto;
import com.stockplanner.model.dto.StockDto;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

@Component
@Slf4j
public class AlphaVantageClient implements StockApiClient {

    private final RestTemplate restTemplate;
    private final String apiKey;
    private final String baseUrl;

    public AlphaVantageClient(
            RestTemplate restTemplate,
            @Value("${stock-api.alphavantage.api-key}") String apiKey,
            @Value("${stock-api.alphavantage.base-url}") String baseUrl) {
        this.restTemplate = restTemplate;
        this.apiKey = apiKey;
        this.baseUrl = baseUrl;
    }

    @Override
    @Cacheable(value = "usQuotes", key = "#ticker")
    public StockDto fetchQuote(String ticker) {
        String url = String.format("%s?function=GLOBAL_QUOTE&symbol=%s&apikey=%s", baseUrl, ticker, apiKey);
        try {
            JsonNode response = restTemplate.getForObject(url, JsonNode.class);
            if (response == null || !response.has("Global Quote")) {
                throw new ExternalApiException("Failed to fetch quote for " + ticker);
            }
            JsonNode quote = response.get("Global Quote");
            return StockDto.builder()
                    .ticker(ticker)
                    .name(ticker)
                    .market("US")
                    .currency("USD")
                    .price(parseDouble(quote, "05. price"))
                    .changePercent(parsePercentage(quote, "10. change percent"))
                    .build();
        } catch (ExternalApiException e) {
            throw e;
        } catch (Exception e) {
            log.error("Error fetching quote for {}: {}", ticker, e.getMessage());
            throw new ExternalApiException("Failed to fetch quote for " + ticker, e);
        }
    }

    @Override
    @Cacheable(value = "usDailyPrices", key = "#ticker + '-' + #from + '-' + #to")
    public List<ChartDataDto> fetchDailyPrices(String ticker, String from, String to) {
        String url = String.format("%s?function=TIME_SERIES_DAILY&symbol=%s&outputsize=full&apikey=%s",
                baseUrl, ticker, apiKey);
        try {
            JsonNode response = restTemplate.getForObject(url, JsonNode.class);
            if (response == null || !response.has("Time Series (Daily)")) {
                throw new ExternalApiException("Failed to fetch daily prices for " + ticker);
            }
            JsonNode timeSeries = response.get("Time Series (Daily)");
            List<ChartDataDto> result = new ArrayList<>();

            Iterator<Map.Entry<String, JsonNode>> fields = timeSeries.fields();
            while (fields.hasNext()) {
                Map.Entry<String, JsonNode> entry = fields.next();
                String date = entry.getKey();
                if ((from == null || date.compareTo(from) >= 0) &&
                        (to == null || date.compareTo(to) <= 0)) {
                    JsonNode day = entry.getValue();
                    result.add(ChartDataDto.builder()
                            .time(date)
                            .open(parseDouble(day, "1. open"))
                            .high(parseDouble(day, "2. high"))
                            .low(parseDouble(day, "3. low"))
                            .close(parseDouble(day, "4. close"))
                            .volume(parseLong(day, "5. volume"))
                            .build());
                }
            }
            result.sort((a, b) -> a.getTime().compareTo(b.getTime()));
            return result;
        } catch (ExternalApiException e) {
            throw e;
        } catch (Exception e) {
            log.error("Error fetching daily prices for {}: {}", ticker, e.getMessage());
            throw new ExternalApiException("Failed to fetch daily prices for " + ticker, e);
        }
    }

    @Override
    @Cacheable(value = "usSearch", key = "#query")
    public List<StockDto> searchStocks(String query) {
        String url = String.format("%s?function=SYMBOL_SEARCH&keywords=%s&apikey=%s", baseUrl, query, apiKey);
        try {
            JsonNode response = restTemplate.getForObject(url, JsonNode.class);
            if (response == null || !response.has("bestMatches")) {
                return List.of();
            }
            List<StockDto> results = new ArrayList<>();
            for (JsonNode match : response.get("bestMatches")) {
                String region = match.has("4. region") ? match.get("4. region").asText() : "";
                if ("United States".equals(region)) {
                    results.add(StockDto.builder()
                            .ticker(match.get("1. symbol").asText())
                            .name(match.get("2. name").asText())
                            .market("US")
                            .currency("USD")
                            .exchange(match.has("4. region") ? match.get("4. region").asText() : "")
                            .build());
                }
            }
            return results;
        } catch (Exception e) {
            log.error("Error searching stocks for {}: {}", query, e.getMessage());
            return List.of();
        }
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

    private double parsePercentage(JsonNode node, String field) {
        if (node == null || !node.has(field)) return 0;
        try {
            String text = node.get(field).asText().replace("%", "").replace(",", "");
            return Double.parseDouble(text);
        } catch (NumberFormatException e) {
            return 0;
        }
    }
}
