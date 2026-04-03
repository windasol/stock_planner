package com.stockplanner.service;

import com.stockplanner.model.dto.NewsDto;
import com.stockplanner.service.external.NewsApiClient;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@Service
@Slf4j
public class NewsService {

    private final List<NewsApiClient> newsClients;

    public NewsService(List<NewsApiClient> newsClients) {
        this.newsClients = newsClients;
    }

    /**
     * 키워드로 뉴스 검색. market이 없으면 전체(US+KR) 조회.
     */
    public List<NewsDto> searchNews(String keyword, String market, int limit) {
        List<NewsDto> results = new ArrayList<>();

        for (NewsApiClient client : newsClients) {
            if (market == null || market.isBlank() || client.getSupportedMarket().equalsIgnoreCase(market)) {
                try {
                    results.addAll(client.fetchNewsByKeyword(keyword, limit));
                } catch (Exception e) {
                    log.warn("News client {} failed for keyword {}: {}",
                            client.getClass().getSimpleName(), keyword, e.getMessage());
                }
            }
        }

        // 최신순 정렬 후 limit 적용
        results.sort(Comparator.comparing(NewsDto::getPublishedAt, Comparator.reverseOrder()));
        return results.size() > limit ? results.subList(0, limit) : results;
    }
}
