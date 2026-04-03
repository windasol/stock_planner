package com.stockplanner.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NewsDto {
    private String title;
    private String summary;
    private String url;
    private String source;
    private String publishedAt;
    private String sentiment;      // positive, negative, neutral
    private Double sentimentScore;
    private String market;         // US, KR
}
