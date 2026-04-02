package com.stockplanner.controller;

import com.stockplanner.model.dto.ChartDataDto;
import com.stockplanner.service.ChartService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/charts")
@RequiredArgsConstructor
public class ChartController {

    private final ChartService chartService;

    @GetMapping("/{market}/{ticker}")
    public List<ChartDataDto> getChartData(
            @PathVariable String market,
            @PathVariable String ticker,
            @RequestParam(defaultValue = "1d") String interval,
            @RequestParam(required = false) String from,
            @RequestParam(required = false) String to) {
        return chartService.getChartData(market, ticker, interval, from, to);
    }
}
