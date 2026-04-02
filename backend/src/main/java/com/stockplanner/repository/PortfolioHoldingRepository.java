package com.stockplanner.repository;

import com.stockplanner.model.entity.PortfolioHolding;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PortfolioHoldingRepository extends JpaRepository<PortfolioHolding, Long> {
}
