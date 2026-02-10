package com.safe.backend.domain.diagnosis.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "AI_DIAG_SESSION")
public class AiDiagSession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "diag_id")
    private Long diagId;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "overall_score")
    private Integer overallScore;

    @Column(name = "diagnosis_name", length = 100)
    private String diagnosisName;

    @Column(name = "top3_types", length = 100)
    private String top3Types;

    @Column(name = "ai_comment", columnDefinition = "TEXT")
    private String aiComment;

    @Column(length = 500)
    private String summary;

    @Column(name = "created_date")
    private LocalDateTime createdDate;

    @Column(name = "updated_date")
    private LocalDateTime updatedDate;

    @PrePersist
    protected void onCreate() {
        this.createdDate = LocalDateTime.now();
        this.updatedDate = LocalDateTime.now();
    }
}