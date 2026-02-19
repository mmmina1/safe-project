package com.safe.backend.domain.admin.dashboard;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

@Getter
@AllArgsConstructor
public class RiskTrendResponse {

    private String range;              // "24h" 등
    private List<RiskTrendPoint> points;
}
