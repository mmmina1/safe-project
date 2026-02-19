package com.safe.backend.domain.admin.dashboard;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class RiskTrendPoint {
    private String hour;  // "00" ~ "23"
    private long count;   // 해당 시간대 탐지 건수
}
