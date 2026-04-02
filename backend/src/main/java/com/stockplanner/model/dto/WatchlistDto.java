package com.stockplanner.model.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WatchlistDto {
    private Long id;
    private StockDto stock;
    private String note;
    private String addedAt;
}
