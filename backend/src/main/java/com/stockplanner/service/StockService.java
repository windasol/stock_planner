package com.stockplanner.service;

import com.stockplanner.model.dto.SearchResultDto;
import com.stockplanner.model.dto.StockDto;
import com.stockplanner.model.entity.Stock;
import com.stockplanner.model.enums.Market;
import com.stockplanner.repository.StockRepository;
import com.stockplanner.service.external.AlphaVantageClient;
import com.stockplanner.service.external.KisClient;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class StockService {

    private final StockRepository stockRepository;
    private final AlphaVantageClient alphaVantageClient;
    private final KisClient kisClient;

    public StockDto getStock(String market, String ticker) {
        Market m = Market.valueOf(market.toUpperCase());

        // 1. DB에서 먼저 조회 (없으면 저장)
        Stock stock = stockRepository.findByTickerIgnoreCaseAndMarket(ticker, m)
                .orElseGet(() -> {
                    StockDto dto = fetchFromExternal(m, ticker);
                    return saveStock(dto);
                });

        // 2. 실시간 가격 정보 조회 (캐시됨)
        StockDto liveQuote = fetchFromExternal(m, ticker);

        return StockDto.builder()
                .id(stock.getId())
                .ticker(stock.getTicker())
                .name(stock.getName())
                .sector(stock.getSector())
                .market(stock.getMarket().name())
                .currency(stock.getCurrency())
                .marketCap(stock.getMarketCap())
                .exchange(stock.getExchange())
                .description(stock.getDescription())
                .price(liveQuote.getPrice())
                .changePercent(liveQuote.getChangePercent())
                .build();
    }

    public List<SearchResultDto> search(String query, String market) {
        Market m = market != null && !market.isEmpty() ? Market.valueOf(market.toUpperCase()) : null;

        // DB 검색
        List<Stock> dbResults = stockRepository.search(query, m);
        List<SearchResultDto> results = new ArrayList<>(dbResults.stream()
                .map(s -> SearchResultDto.builder()
                        .ticker(s.getTicker())
                        .name(s.getName())
                        .market(s.getMarket().name())
                        .exchange(s.getExchange())
                        .sector(s.getSector())
                        .build())
                .toList());

        // 외부 API 검색 보충
        if (results.size() < 5) {
            if (m == null || m == Market.US) {
                alphaVantageClient.searchStocks(query).forEach(dto ->
                        results.add(SearchResultDto.builder()
                                .ticker(dto.getTicker())
                                .name(dto.getName())
                                .market("US")
                                .exchange(dto.getExchange())
                                .build()));
            }
            if (m == null || m == Market.KR) {
                kisClient.searchStocks(query).forEach(dto ->
                        results.add(SearchResultDto.builder()
                                .ticker(dto.getTicker())
                                .name(dto.getName())
                                .market("KR")
                                .exchange(dto.getExchange())
                                .build()));
            }
        }

        return results;
    }

    public Stock getOrCreateStock(String market, String ticker) {
        Market m = Market.valueOf(market.toUpperCase());
        return stockRepository.findByTickerIgnoreCaseAndMarket(ticker, m)
                .orElseGet(() -> {
                    StockDto dto = fetchFromExternal(m, ticker);
                    return saveStock(dto);
                });
    }

    private StockDto fetchFromExternal(Market market, String ticker) {
        if (market == Market.US) {
            return alphaVantageClient.fetchQuote(ticker);
        } else {
            return kisClient.fetchQuote(ticker);
        }
    }

    private Stock saveStock(StockDto dto) {
        Stock stock = Stock.builder()
                .ticker(dto.getTicker())
                .name(dto.getName())
                .market(Market.valueOf(dto.getMarket()))
                .currency(dto.getCurrency())
                .sector(dto.getSector())
                .marketCap(dto.getMarketCap())
                .exchange(dto.getExchange())
                .description(dto.getDescription())
                .build();
        return stockRepository.save(stock);
    }

}
