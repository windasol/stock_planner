package com.stockplanner.service;

import com.stockplanner.exception.StockNotFoundException;
import com.stockplanner.model.dto.SearchResultDto;
import com.stockplanner.model.dto.StockDto;
import com.stockplanner.model.entity.Stock;
import com.stockplanner.model.enums.Market;
import com.stockplanner.repository.StockRepository;
import com.stockplanner.service.external.TwelveDataClient;
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
    private final TwelveDataClient twelveDataClient;

    public StockDto getStock(String market, String ticker) {
        Market m = Market.valueOf(market.toUpperCase());

        // 현재가는 항상 API에서 가져옴 (TwelveDataClient에서 Caffeine 5분 캐시 적용)
        StockDto freshQuote = twelveDataClient.fetchQuote(ticker, market.toUpperCase());

        // 메타데이터(이름, 섹터 등)는 DB에서 보완 — 없으면 저장
        return stockRepository.findByTickerIgnoreCaseAndMarket(ticker, m)
                .map(stock -> mergeWithFreshQuote(stock, freshQuote))
                .orElseGet(() -> {
                    saveStock(freshQuote);
                    return freshQuote;
                });
    }

    public List<SearchResultDto> search(String query, String market) {
        Market m = (market != null && !market.isEmpty()) ? Market.valueOf(market.toUpperCase()) : null;

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

        if (results.size() < 5) {
            twelveDataClient.searchStocks(query, market).forEach(dto ->
                    results.add(SearchResultDto.builder()
                            .ticker(dto.getTicker())
                            .name(dto.getName())
                            .market(dto.getMarket())
                            .exchange(dto.getExchange())
                            .build()));
        }

        return results;
    }

    public Stock getOrCreateStock(String market, String ticker) {
        Market m = Market.valueOf(market.toUpperCase());
        return stockRepository.findByTickerIgnoreCaseAndMarket(ticker, m)
                .orElseGet(() -> {
                    StockDto dto = twelveDataClient.fetchQuote(ticker, market.toUpperCase());
                    return saveStock(dto);
                });
    }

    // DB의 한국어 이름/섹터 정보를 유지하면서, 가격은 항상 API에서 받은 최신값 사용
    private StockDto mergeWithFreshQuote(Stock stock, StockDto freshQuote) {
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
                .price(freshQuote.getPrice())
                .changePercent(freshQuote.getChangePercent())
                .build();
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
