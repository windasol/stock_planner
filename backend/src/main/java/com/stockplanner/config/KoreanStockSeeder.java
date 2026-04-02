package com.stockplanner.config;

import com.stockplanner.model.entity.Stock;
import com.stockplanner.model.enums.Market;
import com.stockplanner.repository.StockRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class KoreanStockSeeder implements ApplicationRunner {

    private final StockRepository stockRepository;

    private static final List<String[]> KR_STOCKS = List.of(
            // {ticker, 한국어이름, sector, exchange}
            new String[]{"005930", "삼성전자", "반도체", "KRX"},
            new String[]{"000660", "SK하이닉스", "반도체", "KRX"},
            new String[]{"373220", "LG에너지솔루션", "2차전지", "KRX"},
            new String[]{"207940", "삼성바이오로직스", "바이오", "KRX"},
            new String[]{"005380", "현대차", "자동차", "KRX"},
            new String[]{"000270", "기아", "자동차", "KRX"},
            new String[]{"068270", "셀트리온", "바이오", "KRX"},
            new String[]{"005490", "POSCO홀딩스", "철강", "KRX"},
            new String[]{"105560", "KB금융", "금융", "KRX"},
            new String[]{"055550", "신한지주", "금융", "KRX"},
            new String[]{"006400", "삼성SDI", "2차전지", "KRX"},
            new String[]{"051910", "LG화학", "화학", "KRX"},
            new String[]{"035420", "NAVER", "IT서비스", "KRX"},
            new String[]{"035720", "카카오", "IT서비스", "KRX"},
            new String[]{"012330", "현대모비스", "자동차부품", "KRX"},
            new String[]{"028260", "삼성물산", "건설", "KRX"},
            new String[]{"066570", "LG전자", "전자", "KRX"},
            new String[]{"003550", "LG", "지주회사", "KRX"},
            new String[]{"017670", "SK텔레콤", "통신", "KRX"},
            new String[]{"030200", "KT", "통신", "KRX"},
            new String[]{"032830", "삼성생명", "보험", "KRX"},
            new String[]{"086790", "하나금융지주", "금융", "KRX"},
            new String[]{"018260", "삼성에스디에스", "IT서비스", "KRX"},
            new String[]{"034730", "SK", "지주회사", "KRX"},
            new String[]{"015760", "한국전력", "에너지", "KRX"},
            new String[]{"009150", "삼성전기", "전자부품", "KRX"},
            new String[]{"003670", "포스코퓨처엠", "2차전지소재", "KRX"},
            new String[]{"010950", "S-Oil", "정유", "KRX"},
            new String[]{"096770", "SK이노베이션", "정유", "KRX"},
            new String[]{"011200", "HMM", "해운", "KRX"},
            new String[]{"000810", "삼성화재", "보험", "KRX"},
            new String[]{"316140", "우리금융지주", "금융", "KRX"},
            new String[]{"033780", "KT&G", "담배", "KRX"},
            new String[]{"047810", "한국항공우주", "항공우주", "KRX"},
            new String[]{"009830", "한화솔루션", "화학", "KRX"},
            new String[]{"042700", "한미반도체", "반도체장비", "KRX"},
            new String[]{"000100", "유한양행", "제약", "KRX"},
            new String[]{"097950", "CJ제일제당", "식품", "KRX"},
            new String[]{"271560", "오리온", "식품", "KRX"},
            new String[]{"005935", "삼성전자우", "반도체", "KRX"},
            new String[]{"251270", "넷마블", "게임", "KRX"},
            new String[]{"036570", "엔씨소프트", "게임", "KRX"},
            new String[]{"112040", "위메이드", "게임", "KRX"},
            new String[]{"259960", "크래프톤", "게임", "KRX"},
            new String[]{"352820", "하이브", "엔터테인먼트", "KRX"},
            new String[]{"041510", "에스엠", "엔터테인먼트", "KRX"},
            new String[]{"035900", "JYP엔터테인먼트", "엔터테인먼트", "KRX"},
            new String[]{"122630", "KODEX 레버리지", "ETF", "KRX"},
            new String[]{"069500", "KODEX 200", "ETF", "KRX"},
            new String[]{"114800", "KODEX 인버스", "ETF", "KRX"}
    );

    @Override
    public void run(ApplicationArguments args) {
        int inserted = 0;
        for (String[] s : KR_STOCKS) {
            String ticker = s[0];
            if (stockRepository.findByTickerIgnoreCaseAndMarket(ticker, Market.KR).isEmpty()) {
                stockRepository.save(Stock.builder()
                        .ticker(ticker)
                        .name(s[1])
                        .sector(s[2])
                        .exchange(s[3])
                        .market(Market.KR)
                        .currency("KRW")
                        .build());
                inserted++;
            }
        }
        if (inserted > 0) {
            log.info("한국 주식 시드 데이터 {} 건 추가 완료", inserted);
        }
    }
}
