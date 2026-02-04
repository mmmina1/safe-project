package com.safe.backend.domain.admin.community;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@NoArgsConstructor
@Entity
@Table(name = "post_reports")
public class PostReport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "report_id")
    private Long reportId; // DB: PK - USERS.user_id 신고 ID (스키마 설명이 이상하지만 report_id로 사용)

    @Column(name = "post_id", nullable = false)
    private Long postId;

    @Column(name = "reporter_id")
    private Long reporterId; // 신고한 사용자 ID

    @Column(name = "reason", length = 500)
    private String reason;

    @Column(name = "status", nullable = false, length = 20)
    private String status = "접수"; // DB: ENUM('접수','반려','처리완료')

    @Column(name = "admin_id")
    private Long adminId; // 처리한 관리자 ID

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt; // DB: 신고 일시

    @Column(name = "processed_at")
    private LocalDateTime processedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    public static PostReport of(Long postId, Long reporterId, String reason) {
        PostReport report = new PostReport();
        report.postId = postId;
        report.reporterId = reporterId;
        report.reason = reason;
        report.status = "접수";
        return report;
    }

    public void approve(Long adminId) {
        this.status = "처리완료";
        this.adminId = adminId;
        this.processedAt = LocalDateTime.now();
    }

    public void reject(Long adminId) {
        this.status = "반려";
        this.adminId = adminId;
        this.processedAt = LocalDateTime.now();
    }
}
