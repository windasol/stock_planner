package com.stockplanner.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/market")
@RequiredArgsConstructor
public class MarketController {

    @GetMapping("/indices")
    public List<Map<String, Object>> getIndices() {
        // TODO: 실시간 지수 데이터 연동
        return List.of(
                Map.of("name", "S&P 500", "value", 5200.0, "changePercent", 0.5, "market", "US"),
                Map.of("name", "NASDAQ", "value", 16400.0, "changePercent", 0.8, "market", "US"),
                Map.of("name", "KOSPI", "value", 2680.0, "changePercent", -0.3, "market", "KR"),
                Map.of("name", "KOSDAQ", "value", 870.0, "changePercent", 0.2, "market", "KR")
        );
    }

    @GetMapping("/top-movers")
    public List<Map<String, Object>> getTopMovers() {
        // TODO: 실시간 등락 상위 종목 연동
        return List.of();
    }

    @GetMapping("/sectors")
    public List<Map<String, Object>> getSectors() {
        // TODO: 섹터별 수익률 연동
        return List.of();
    }
}
