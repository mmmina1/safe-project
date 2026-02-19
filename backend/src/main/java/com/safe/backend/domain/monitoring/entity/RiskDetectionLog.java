package com.safe.backend.domain.monitoring.entity;

import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Table(name = "risk_detection_log")
public class RiskDetectionLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long detectId;

    private Long userId;
    private Long fraudTypeId;
    private Integer riskScore;
    private String region;
    private LocalDate createdDate;
}

