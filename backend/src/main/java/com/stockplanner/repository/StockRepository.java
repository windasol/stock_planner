package com.stockplanner.repository;

import com.stockplanner.model.entity.Stock;
import com.stockplanner.model.enums.Market;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface StockRepository extends JpaRepository<Stock, Long> {

    Optional<Stock> findByTickerIgnoreCase(String ticker);

    Optional<Stock> findByTickerIgnoreCaseAndMarket(String ticker, Market market);

    @Query("SELECT s FROM Stock s WHERE " +
            "(LOWER(s.ticker) LIKE LOWER(CONCAT('%', :query, '%')) " +
            "OR LOWER(s.name) LIKE LOWER(CONCAT('%', :query, '%'))) " +
            "AND (:market IS NULL OR s.market = :market)")
    List<Stock> search(@Param("query") String query, @Param("market") Market market);
}
