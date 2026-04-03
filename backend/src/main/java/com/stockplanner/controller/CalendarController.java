package com.stockplanner.controller;

import com.stockplanner.model.dto.EconomicEventDto;
import com.stockplanner.model.dto.StockEventDto;
import com.stockplanner.service.CalendarService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/calendar")
@RequiredArgsConstructor
public class CalendarController {

    private final CalendarService calendarService;

    /**
     * 글로벌 매크로 경제 캘린더
     * GET /api/calendar/economic?from=2025-04-01&to=2025-04-30
     */
    @GetMapping("/economic")
    public List<EconomicEventDto> getEconomicCalendar(
            @RequestParam(required = false) String from,
            @RequestParam(required = false) String to) {
        return calendarService.getEconomicCalendar(from, to);
    }

    /**
     * 종목별 이벤트 캘린더 (실적 + 배당 + 분할)
     * GET /api/calendar/stock/AAPL?from=2025-01-01&to=2025-12-31
     */
    @GetMapping("/stock/{symbol}")
    public List<StockEventDto> getStockEvents(
            @PathVariable String symbol,
            @RequestParam(required = false) String from,
            @RequestParam(required = false) String to) {
        if (symbol == null || symbol.isBlank()) {
            throw new IllegalArgumentException("종목 코드를 입력해주세요.");
        }
        return calendarService.getStockEvents(symbol, from, to);
    }
}
