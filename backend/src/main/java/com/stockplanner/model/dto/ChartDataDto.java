package com.stockplanner.model.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChartDataDto {
    private String time;
    private double open;
    private double high;
    private double low;
    private double close;
    private long volume;
}
