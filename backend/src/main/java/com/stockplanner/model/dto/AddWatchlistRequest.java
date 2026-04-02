package com.stockplanner.model.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AddWatchlistRequest {
    @NotBlank
    private String ticker;

    @NotBlank
    private String market;

    private String note;
}
