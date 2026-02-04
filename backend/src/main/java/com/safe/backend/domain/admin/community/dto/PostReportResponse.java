package com.safe.backend.domain.admin.community.dto;

import com.safe.backend.domain.admin.community.PostReport;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class PostReportResponse {
    private Long reportId;
    private Long postId;
    private Long reporterId;
    private String reason;
    private String status; // 접수, 반려, 처리완료
    private Long adminId;
    private LocalDateTime createdAt;
    private LocalDateTime processedAt;

    public PostReportResponse(PostReport report) {
        this.reportId = report.getReportId();
        this.postId = report.getPostId();
        this.reporterId = report.getReporterId();
        this.reason = report.getReason();
        this.status = report.getStatus();
        this.adminId = report.getAdminId();
        this.createdAt = report.getCreatedAt();
        this.processedAt = report.getProcessedAt();
    }
}
