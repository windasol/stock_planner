package com.stockplanner.service.external;

import com.stockplanner.model.dto.ChartDataDto;
import com.stockplanner.model.dto.StockDto;

import java.util.List;

public interface StockApiClient {

    StockDto fetchQuote(String ticker);

    List<ChartDataDto> fetchDailyPrices(String ticker, String from, String to);

    List<StockDto> searchStocks(String query);
}
