package com.safe.backend.domain.monitoring.entity;

import java.time.LocalDateTime;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor
public class FraudLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fraudType;
    private String region;
    private int riskScore;
    private LocalDateTime createdAt = LocalDateTime.now();
}
