package com.stockplanner.service;

import com.stockplanner.model.dto.*;
import com.stockplanner.model.entity.Portfolio;
import com.stockplanner.model.entity.PortfolioHolding;
import com.stockplanner.model.entity.Stock;
import com.stockplanner.repository.PortfolioHoldingRepository;
import com.stockplanner.repository.PortfolioRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PortfolioService {

    private final PortfolioRepository portfolioRepository;
    private final PortfolioHoldingRepository holdingRepository;
    private final StockService stockService;

    public List<PortfolioDto> getAll() {
        return portfolioRepository.findAll().stream()
                .map(this::toDto)
                .toList();
    }

    public PortfolioDto getById(Long id) {
        return toDto(findPortfolio(id));
    }

    public PortfolioDto create(CreatePortfolioRequest request) {
        Portfolio portfolio = Portfolio.builder()
                .name(request.getName())
                .build();
        return toDto(portfolioRepository.save(portfolio));
    }

    @Transactional
    public void delete(Long id) {
        portfolioRepository.deleteById(id);
    }

    @Transactional
    public HoldingDto addHolding(Long portfolioId, AddHoldingRequest request) {
        Portfolio portfolio = findPortfolio(portfolioId);
        Stock stock = stockService.getOrCreateStock(request.getMarket(), request.getTicker());

        PortfolioHolding holding = PortfolioHolding.builder()
                .portfolio(portfolio)
                .stock(stock)
                .quantity(BigDecimal.valueOf(request.getQuantity()))
                .avgBuyPrice(BigDecimal.valueOf(request.getAvgBuyPrice()))
                .boughtAt(request.getBoughtAt() != null ? LocalDate.parse(request.getBoughtAt()) : LocalDate.now())
                .build();

        return toHoldingDto(holdingRepository.save(holding));
    }

    @Transactional
    public void deleteHolding(Long portfolioId, Long holdingId) {
        holdingRepository.deleteById(holdingId);
    }

    private Portfolio findPortfolio(Long id) {
        return portfolioRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Portfolio not found: " + id));
    }

    private PortfolioDto toDto(Portfolio portfolio) {
        List<HoldingDto> holdings = portfolio.getHoldings().stream()
                .map(this::toHoldingDto)
                .toList();

        double totalValue = holdings.stream().mapToDouble(HoldingDto::getCurrentValue).sum();
        double totalCost = portfolio.getHoldings().stream()
                .mapToDouble(h -> h.getQuantity().doubleValue() * h.getAvgBuyPrice().doubleValue())
                .sum();
        double totalReturn = totalValue - totalCost;
        double totalReturnPercent = totalCost > 0 ? (totalReturn / totalCost) * 100 : 0;

        return PortfolioDto.builder()
                .id(portfolio.getId())
                .name(portfolio.getName())
                .holdings(holdings)
                .totalValue(totalValue)
                .totalReturn(totalReturn)
                .totalReturnPercent(totalReturnPercent)
                .createdAt(portfolio.getCreatedAt() != null ? portfolio.getCreatedAt().toString() : null)
                .build();
    }

    private HoldingDto toHoldingDto(PortfolioHolding holding) {
        double qty = holding.getQuantity().doubleValue();
        double avgPrice = holding.getAvgBuyPrice().doubleValue();
        // TODO: 현재가를 외부 API에서 가져와서 실시간 수익률 계산
        double currentValue = qty * avgPrice;
        double returnPercent = 0;

        return HoldingDto.builder()
                .id(holding.getId())
                .stock(StockDto.builder()
                        .id(holding.getStock().getId())
                        .ticker(holding.getStock().getTicker())
                        .name(holding.getStock().getName())
                        .market(holding.getStock().getMarket().name())
                        .currency(holding.getStock().getCurrency())
                        .build())
                .quantity(qty)
                .avgBuyPrice(avgPrice)
                .currentValue(currentValue)
                .returnPercent(returnPercent)
                .boughtAt(holding.getBoughtAt() != null ? holding.getBoughtAt().toString() : null)
                .build();
    }
}
