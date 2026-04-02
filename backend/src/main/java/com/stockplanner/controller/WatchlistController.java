package com.stockplanner.controller;

import com.stockplanner.model.dto.AddWatchlistRequest;
import com.stockplanner.model.dto.WatchlistDto;
import com.stockplanner.service.WatchlistService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/watchlist")
@RequiredArgsConstructor
public class WatchlistController {

    private final WatchlistService watchlistService;

    @GetMapping
    public List<WatchlistDto> getAll() {
        return watchlistService.getAll();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public WatchlistDto add(@Valid @RequestBody AddWatchlistRequest request) {
        return watchlistService.add(request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        watchlistService.delete(id);
    }
}
