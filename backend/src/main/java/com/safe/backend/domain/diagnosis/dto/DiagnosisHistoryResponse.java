package com.safe.backend.domain.diagnosis.dto;

import java.time.LocalDateTime;
import java.util.List;

public record DiagnosisHistoryResponse(
        Long diagId,
        Integer score,
        String summary,
        List<String> top3Types,
        LocalDateTime createdDate,
        List<RecommendationResponse> recommendations) {
    public record RecommendationResponse(
            String recText,
            boolean isChecked,
            Integer sortOrder) {
    }
}
