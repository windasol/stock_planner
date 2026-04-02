package com.stockplanner.controller;

import com.stockplanner.model.dto.*;
import com.stockplanner.service.PortfolioService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/portfolios")
@RequiredArgsConstructor
public class PortfolioController {

    private final PortfolioService portfolioService;

    @GetMapping
    public List<PortfolioDto> getAll() {
        return portfolioService.getAll();
    }

    @GetMapping("/{id}")
    public PortfolioDto getById(@PathVariable Long id) {
        return portfolioService.getById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public PortfolioDto create(@Valid @RequestBody CreatePortfolioRequest request) {
        return portfolioService.create(request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        portfolioService.delete(id);
    }

    @PostMapping("/{id}/holdings")
    @ResponseStatus(HttpStatus.CREATED)
    public HoldingDto addHolding(
            @PathVariable Long id,
            @Valid @RequestBody AddHoldingRequest request) {
        return portfolioService.addHolding(id, request);
    }

    @DeleteMapping("/{portfolioId}/holdings/{holdingId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteHolding(
            @PathVariable Long portfolioId,
            @PathVariable Long holdingId) {
        portfolioService.deleteHolding(portfolioId, holdingId);
    }
}
