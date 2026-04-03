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
