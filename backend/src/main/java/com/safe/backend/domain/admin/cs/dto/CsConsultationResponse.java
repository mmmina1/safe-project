package com.safe.backend.domain.admin.cs.dto;

import com.safe.backend.domain.admin.cs.CsConsultation;
import com.safe.backend.domain.admin.cs.ConsultationStatus;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class CsConsultationResponse {
    private Long consultationId;
    private Long userId;
    private Long adminId;
    private String memo;
    private ConsultationStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public CsConsultationResponse(CsConsultation consultation) {
        this.consultationId = consultation.getConsultationId();
        this.userId = consultation.getUserId();
        this.adminId = consultation.getAdminId();
        this.memo = consultation.getMemo();
        this.status = consultation.getStatus();
        this.createdAt = consultation.getCreatedAt();
        this.updatedAt = consultation.getUpdatedAt();
    }
}
