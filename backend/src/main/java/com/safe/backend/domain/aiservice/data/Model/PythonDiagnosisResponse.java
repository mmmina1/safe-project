package com.safe.backend.domain.aiservice.data.Model;

import java.util.List;

public record PythonDiagnosisResponse(
        String aiComment,
        List<String> top3Types,
        List<String> recommendations) {
}
