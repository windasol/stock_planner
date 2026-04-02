package com.stockplanner.repository;

import com.stockplanner.model.entity.Watchlist;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface WatchlistRepository extends JpaRepository<Watchlist, Long> {

    List<Watchlist> findAllByOrderByAddedAtDesc();
}
