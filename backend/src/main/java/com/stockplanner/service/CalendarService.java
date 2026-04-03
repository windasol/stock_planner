package com.stockplanner.service;

import com.stockplanner.model.dto.EconomicEventDto;
import com.stockplanner.model.dto.StockEventDto;
import com.stockplanner.service.external.FinnhubClient;
import com.stockplanner.service.external.FmpClient;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class CalendarService {

    private final FinnhubClient finnhubClient;
    private final FmpClient fmpClient;
    private static final DateTimeFormatter DATE_FMT = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    /**
     * 글로벌 경제 캘린더 조회 (FMP).
     * from/to가 null이면 오늘부터 30일 범위를 기본 적용.
     */
    public List<EconomicEventDto> getEconomicCalendar(String from, String to) {
        String f = from != null ? from : LocalDate.now().format(DATE_FMT);
        String t = to   != null ? to   : LocalDate.now().plusDays(30).format(DATE_FMT);
        return fmpClient.fetchEconomicCalendar(f, t);
    }

    /**
     * 종목별 이벤트 조회 (실적 + 배당 + 분할 통합).
     * US 종목만 지원 (KR은 Finnhub 미지원).
     * from/to가 null이면 오늘부터 90일 범위를 기본 적용.
     */
    public List<StockEventDto> getStockEvents(String symbol, String from, String to) {
        String f = from != null ? from : LocalDate.now().minusDays(30).format(DATE_FMT);
        String t = to   != null ? to   : LocalDate.now().plusDays(90).format(DATE_FMT);

        String upperSymbol = symbol.toUpperCase();

        List<StockEventDto> all = new ArrayList<>();
        all.addAll(finnhubClient.fetchEarningsCalendar(upperSymbol, f, t));
        all.addAll(finnhubClient.fetchDividendCalendar(upperSymbol, f, t));
        all.addAll(finnhubClient.fetchSplitCalendar(upperSymbol, f, t));

        // 날짜 오름차순 정렬
        all.sort((a, b) -> a.getDate().compareTo(b.getDate()));
        return all;
    }
}
