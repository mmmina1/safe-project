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
@Table(name = "AI_DIAG_RECOMMENDATION")
public class AiDiagRecommendation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "rec_id")
    private Long recId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "diag_id", nullable = false)
    private AiDiagSession diagSession;

    @Column(name = "rec_text", length = 300)
    private String recText;

    @Column(name = "is_checked")
    private boolean isChecked;

    @Column(name = "checked_at")
    private LocalDateTime checkedAt;

    @Column(name = "sort_order")
    private Integer sortOrder;

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