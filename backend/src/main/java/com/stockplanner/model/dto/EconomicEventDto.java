package com.stockplanner.model.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class EconomicEventDto {
    private String date;       // yyyy-MM-dd
    private String time;       // HH:mm (UTC)
    private String country;    // "US", "KR", "EU" 등
    private String event;      // 이벤트명 (예: "FOMC Interest Rate Decision")
    private String impact;     // "high", "medium", "low"
    private String unit;       // "%", "K", "B" 등
    private Double actual;     // 실제값 (발표 전이면 null)
    private Double estimate;   // 예상값
    private Double previous;   // 이전값
}
