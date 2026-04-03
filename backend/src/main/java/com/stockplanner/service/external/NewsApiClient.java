package com.stockplanner.service.external;

import com.stockplanner.model.dto.NewsDto;

import java.util.List;

public interface NewsApiClient {
    List<NewsDto> fetchNewsByKeyword(String keyword, int limit);
    String getSupportedMarket(); // "US", "KR"

    default List<String> fetchHotKeywords(int topN) {
        return List.of();
    }
}
