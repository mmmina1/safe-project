package com.safe.backend.domain.monitoring.dto.response;

public record FraudTypeResponse(
        String type,
        long count
) {}
