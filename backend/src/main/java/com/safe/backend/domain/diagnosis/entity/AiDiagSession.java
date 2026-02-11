package com.safe.backend.domain.diagnosis.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;

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

    @Column(name = "top3_types", length = 100)
    private String top3Types;

    @Column(columnDefinition = "TEXT")
    private String summary;

    @Column(name = "created_date")
    private LocalDateTime createdDate;

    @Column(name = "updated_date")
    private LocalDateTime updatedDate;

    @OneToMany(mappedBy = "diagSession", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @OrderBy("sortOrder ASC")
    private List<AiDiagRecommendation> recommendations;

    @PrePersist
    protected void onCreate() {
        this.createdDate = LocalDateTime.now();
        this.updatedDate = LocalDateTime.now();
    }
}