package com.stockplanner.controller;

import com.stockplanner.model.dto.NewsDto;
import com.stockplanner.service.NewsService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/news")
@RequiredArgsConstructor
public class NewsController {

    private final NewsService newsService;

    /**
     * 키워드로 뉴스 검색
     * GET /api/news/search?q=AAPL&market=US&limit=20
     * GET /api/news/search?q=삼성전자&market=KR
     * GET /api/news/search?q=금리&limit=30  (시장 구분 없이 전체)
     */
    @GetMapping("/search")
    public List<NewsDto> search(
            @RequestParam String q,
            @RequestParam(required = false) String market,
            @RequestParam(defaultValue = "20") int limit) {
        if (q.isBlank()) throw new IllegalArgumentException("검색어를 입력해주세요.");
        if (limit < 1 || limit > 100) throw new IllegalArgumentException("limit은 1~100 사이여야 합니다.");
        return newsService.searchNews(q, market, limit);
    }
}
