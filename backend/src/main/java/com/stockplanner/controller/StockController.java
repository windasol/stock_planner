package com.stockplanner.controller;

import com.stockplanner.model.dto.SearchResultDto;
import com.stockplanner.model.dto.StockDto;
import com.stockplanner.service.StockService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/stocks")
@RequiredArgsConstructor
public class StockController {

    private final StockService stockService;

    @GetMapping("/search")
    public List<SearchResultDto> search(
            @RequestParam String q,
            @RequestParam(required = false) String market) {
        return stockService.search(q, market);
    }

    @GetMapping("/{market}/{ticker}")
    public StockDto getStock(
            @PathVariable String market,
            @PathVariable String ticker) {
        return stockService.getStock(market, ticker);
    }
}
