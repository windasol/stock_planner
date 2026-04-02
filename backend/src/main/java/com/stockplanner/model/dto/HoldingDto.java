package com.stockplanner.model.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HoldingDto {
    private Long id;
    private StockDto stock;
    private double quantity;
    private double avgBuyPrice;
    private double currentValue;
    private double returnPercent;
    private String boughtAt;
}
