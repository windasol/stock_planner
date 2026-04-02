package com.stockplanner.model.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CreatePortfolioRequest {
    @NotBlank
    private String name;
}
