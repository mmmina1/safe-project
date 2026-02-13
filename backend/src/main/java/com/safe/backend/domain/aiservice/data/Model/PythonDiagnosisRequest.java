package com.safe.backend.domain.aiservice.data.Model;

import java.util.List;
import java.util.Map;

public record PythonDiagnosisRequest(List<Map<String, Object>> answers) {
}
