package com.stockplanner.model.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AddHoldingRequest {
    @NotBlank
    private String ticker;

    @NotBlank
    private String market;

    @Positive
    private double quantity;

    @Positive
    private double avgBuyPrice;

    private String boughtAt;
}
