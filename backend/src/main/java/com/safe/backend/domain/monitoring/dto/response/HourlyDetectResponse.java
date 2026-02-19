package com.safe.backend.domain.monitoring.dto.response;

public record HourlyDetectResponse(
        int hour,      // 0 ~ 23
        long count
) {}