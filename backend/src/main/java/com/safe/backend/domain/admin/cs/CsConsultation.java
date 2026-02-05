package com.safe.backend.domain.admin.cs;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@NoArgsConstructor
@Entity
@Table(name = "cs_consultations")
public class CsConsultation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "consultation_id")
    private Long consultationId;

    @Column(name = "user_id")
    private Long userId;

    @Column(name = "admin_id")
    private Long adminId; // 담당 상담원 ID

    @Lob
    @Column(name = "memo")
    private String memo;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private ConsultationStatus status = ConsultationStatus.PENDING;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public static CsConsultation of(Long userId) {
        CsConsultation c = new CsConsultation();
        c.userId = userId;
        c.status = ConsultationStatus.PENDING;
        return c;
    }

    public void assignAdmin(Long adminId) {
        this.adminId = adminId;
        this.status = ConsultationStatus.IN_PROGRESS;
    }

    public void updateMemo(String memo) {
        this.memo = memo;
    }

    public void complete() {
        this.status = ConsultationStatus.COMPLETED;
    }
}
