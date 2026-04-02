package com.stockplanner.service;

import com.stockplanner.model.dto.AddWatchlistRequest;
import com.stockplanner.model.dto.StockDto;
import com.stockplanner.model.dto.WatchlistDto;
import com.stockplanner.model.entity.Stock;
import com.stockplanner.model.entity.Watchlist;
import com.stockplanner.repository.WatchlistRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class WatchlistService {

    private final WatchlistRepository watchlistRepository;
    private final StockService stockService;

    public List<WatchlistDto> getAll() {
        return watchlistRepository.findAllByOrderByAddedAtDesc().stream()
                .map(this::toDto)
                .toList();
    }

    @Transactional
    public WatchlistDto add(AddWatchlistRequest request) {
        Stock stock = stockService.getOrCreateStock(request.getMarket(), request.getTicker());
        Watchlist watchlist = Watchlist.builder()
                .stock(stock)
                .note(request.getNote())
                .build();
        return toDto(watchlistRepository.save(watchlist));
    }

    @Transactional
    public void delete(Long id) {
        watchlistRepository.deleteById(id);
    }

    private WatchlistDto toDto(Watchlist w) {
        return WatchlistDto.builder()
                .id(w.getId())
                .stock(StockDto.builder()
                        .id(w.getStock().getId())
                        .ticker(w.getStock().getTicker())
                        .name(w.getStock().getName())
                        .market(w.getStock().getMarket().name())
                        .currency(w.getStock().getCurrency())
                        .build())
                .note(w.getNote())
                .addedAt(w.getAddedAt() != null ? w.getAddedAt().toString() : null)
                .build();
    }
}
