package com.stockplanner.model.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class StockEventDto {
    private String date;        // yyyy-MM-dd
    private String type;        // "EARNINGS", "DIVIDEND", "SPLIT"
    private String description; // 표시용 설명

    // 실적 발표 전용
    private Double epsEstimate;
    private Double epsActual;
    private Long   revenueEstimate;
    private Long   revenueActual;
    private String hour;        // "bmo"(장전) | "amc"(장후) | "dmh"(장중)
    private Integer quarter;
    private Integer year;

    // 배당 전용
    private Double dividendAmount;
    private String payDate;
    private String recordDate;
    private String currency;

    // 주식분할 전용
    private Double fromFactor;
    private Double toFactor;
}
