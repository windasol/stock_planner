package com.stockplanner.service;

import com.stockplanner.model.dto.ChartDataDto;
import com.stockplanner.model.entity.PriceHistory;
import com.stockplanner.model.entity.Stock;
import com.stockplanner.model.enums.Market;
import com.stockplanner.repository.PriceHistoryRepository;
import com.stockplanner.service.external.AlphaVantageClient;
import com.stockplanner.service.external.KisClient;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class ChartService {

    private final StockService stockService;
    private final PriceHistoryRepository priceHistoryRepository;
    private final AlphaVantageClient alphaVantageClient;
    private final KisClient kisClient;

    public List<ChartDataDto> getChartData(String market, String ticker, String interval, String from, String to) {
        Stock stock = stockService.getOrCreateStock(market, ticker);

        LocalDate fromDate = from != null ? LocalDate.parse(from) : LocalDate.now().minusMonths(3);
        LocalDate toDate = to != null ? LocalDate.parse(to) : LocalDate.now();

        // DB에서 먼저 조회
        List<PriceHistory> cached = priceHistoryRepository
                .findByStockAndDateBetweenOrderByDateAsc(stock, fromDate, toDate);

        if (!cached.isEmpty()) {
            return cached.stream()
                    .map(this::toDto)
                    .toList();
        }

        // DB에 없으면 외부 API에서 조회 후 저장
        Market m = Market.valueOf(market.toUpperCase());
        List<ChartDataDto> data;
        if (m == Market.US) {
            data = alphaVantageClient.fetchDailyPrices(ticker, from, to);
        } else {
            data = kisClient.fetchDailyPrices(ticker, from, to);
        }

        // DB에 저장
        for (ChartDataDto dto : data) {
            PriceHistory ph = PriceHistory.builder()
                    .stock(stock)
                    .date(LocalDate.parse(dto.getTime()))
                    .open(BigDecimal.valueOf(dto.getOpen()))
                    .high(BigDecimal.valueOf(dto.getHigh()))
                    .low(BigDecimal.valueOf(dto.getLow()))
                    .close(BigDecimal.valueOf(dto.getClose()))
                    .volume(dto.getVolume())
                    .build();
            try {
                priceHistoryRepository.save(ph);
            } catch (Exception e) {
                log.debug("Duplicate price history entry, skipping: {} {}", ticker, dto.getTime());
            }
        }

        return data;
    }

    private ChartDataDto toDto(PriceHistory ph) {
        return ChartDataDto.builder()
                .time(ph.getDate().toString())
                .open(ph.getOpen().doubleValue())
                .high(ph.getHigh().doubleValue())
                .low(ph.getLow().doubleValue())
                .close(ph.getClose().doubleValue())
                .volume(ph.getVolume())
                .build();
    }
}
