package com.stockplanner;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication
@EnableCaching
public class StockPlannerApplication {

    public static void main(String[] args) {
        SpringApplication.run(StockPlannerApplication.class, args);
    }
}
