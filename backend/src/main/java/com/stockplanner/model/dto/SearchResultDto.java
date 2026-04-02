package com.stockplanner.model.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SearchResultDto {
    private String ticker;
    private String name;
    private String market;
    private String exchange;
    private String sector;
}
