package com.stockplanner.model.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StockDto {
    private Long id;
    private String ticker;
    private String name;
    private String sector;
    private String market;
    private String currency;
    private double price;
    private double changePercent;
    private Long marketCap;
    private String exchange;
    private String description;
}
