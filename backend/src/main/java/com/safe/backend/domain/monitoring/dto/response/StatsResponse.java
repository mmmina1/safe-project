package com.safe.backend.domain.monitoring.dto.response;

public record StatsResponse(
        long todayCount,
        long yesterdayCount,      //  추가
        long changeCount,         //  추가
        Double changeRate,        //  Double로 변경 (null 허용)
        long activeRiskCount
) {}
