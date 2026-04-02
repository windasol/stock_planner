package com.stockplanner.model.dto;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PortfolioDto {
    private Long id;
    private String name;
    private List<HoldingDto> holdings;
    private double totalValue;
    private double totalReturn;
    private double totalReturnPercent;
    private String createdAt;
}
