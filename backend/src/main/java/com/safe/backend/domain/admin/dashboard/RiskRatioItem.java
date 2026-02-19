package com.safe.backend.domain.admin.dashboard;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class RiskRatioItem {

    private String label; // PHISHING / SMISHING / MALWARE ...
    private long count;
}
