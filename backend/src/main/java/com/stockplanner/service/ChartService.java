package com.stockplanner.service;

import com.stockplanner.model.dto.ChartDataDto;
import com.stockplanner.model.entity.PriceHistory;
import com.stockplanner.model.entity.Stock;
import com.stockplanner.repository.PriceHistoryRepository;
import com.stockplanner.service.external.TwelveDataClient;
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
    private final TwelveDataClient twelveDataClient;

    public List<ChartDataDto> getChartData(String market, String ticker, String interval, String from, String to) {
        Stock stock = stockService.getOrCreateStock(market, ticker);

        LocalDate fromDate = from != null ? LocalDate.parse(from) : LocalDate.now().minusMonths(3);
        LocalDate toDate = to != null ? LocalDate.parse(to) : LocalDate.now();

        // 당일 분봉(1D)은 실시간 데이터 → DB에 저장하지 않고 Caffeine 캐시만 사용
        boolean isIntraday = "1D".equals(interval);
        if (!isIntraday) {
            List<PriceHistory> cached = priceHistoryRepository
                    .findByStockAndDateBetweenOrderByDateAsc(stock, fromDate, toDate);
            if (!cached.isEmpty()) {
                return cached.stream().map(this::toDto).toList();
            }
        }

        List<ChartDataDto> data = twelveDataClient.fetchTimeSeries(ticker, market.toUpperCase(), interval, from, to);

        // 일봉 이상(확정된 과거 데이터)만 DB에 저장
        if (!isIntraday) {
            for (ChartDataDto dto : data) {
                String dateStr = dto.getTime().length() > 10 ? dto.getTime().substring(0, 10) : dto.getTime();
                PriceHistory ph = PriceHistory.builder()
                        .stock(stock)
                        .date(LocalDate.parse(dateStr))
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
