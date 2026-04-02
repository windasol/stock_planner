package com.stockplanner.repository;

import com.stockplanner.model.entity.PriceHistory;
import com.stockplanner.model.entity.Stock;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface PriceHistoryRepository extends JpaRepository<PriceHistory, Long> {

    List<PriceHistory> findByStockAndDateBetweenOrderByDateAsc(Stock stock, LocalDate from, LocalDate to);

    Optional<PriceHistory> findTopByStockOrderByDateDesc(Stock stock);
}
