package com.stockplanner.config;

import com.github.benmanes.caffeine.cache.Caffeine;
import org.springframework.cache.CacheManager;
import org.springframework.cache.caffeine.CaffeineCache;
import org.springframework.cache.support.SimpleCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;
import java.util.concurrent.TimeUnit;

@Configuration
public class CacheConfig {

    @Bean
    public CacheManager cacheManager() {
        // 주가 데이터: 5분 TTL
        Caffeine<Object, Object> stockSpec = Caffeine.newBuilder()
                .maximumSize(500)
                .expireAfterWrite(5, TimeUnit.MINUTES);

        // 뉴스 데이터: 10분 TTL (뉴스는 자주 바뀌지만 API 할당량 절약)
        Caffeine<Object, Object> newsSpec = Caffeine.newBuilder()
                .maximumSize(200)
                .expireAfterWrite(10, TimeUnit.MINUTES);

        // 캘린더 데이터: 1시간 TTL (하루 단위 데이터라 자주 바뀌지 않음)
        Caffeine<Object, Object> calendarSpec = Caffeine.newBuilder()
                .maximumSize(100)
                .expireAfterWrite(60, TimeUnit.MINUTES);

        List<CaffeineCache> caches = List.of(
                new CaffeineCache("usQuotes", stockSpec.build()),
                new CaffeineCache("usDailyPrices", stockSpec.build()),
                new CaffeineCache("usSearch", stockSpec.build()),
                new CaffeineCache("krQuotes", stockSpec.build()),
                new CaffeineCache("krDailyPrices", stockSpec.build()),
                new CaffeineCache("krSearch", stockSpec.build()),
                new CaffeineCache("krNews", newsSpec.build()),
                new CaffeineCache("economicCalendar", calendarSpec.build()),
                new CaffeineCache("earningsCalendar", calendarSpec.build()),
                new CaffeineCache("dividendCalendar", calendarSpec.build()),
                new CaffeineCache("splitCalendar", calendarSpec.build())
        );

        SimpleCacheManager manager = new SimpleCacheManager();
        manager.setCaches(caches);
        return manager;
    }
}
