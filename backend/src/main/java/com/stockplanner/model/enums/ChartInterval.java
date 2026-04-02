package com.stockplanner.model.enums;

public enum ChartInterval {
    ONE_DAY("1d"),
    ONE_WEEK("1w"),
    ONE_MONTH("1m");

    private final String value;

    ChartInterval(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }

    public static ChartInterval fromValue(String value) {
        for (ChartInterval interval : values()) {
            if (interval.value.equalsIgnoreCase(value)) {
                return interval;
            }
        }
        throw new IllegalArgumentException("Unknown interval: " + value);
    }
}
