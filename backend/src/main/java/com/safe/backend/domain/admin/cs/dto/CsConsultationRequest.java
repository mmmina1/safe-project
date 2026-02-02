package com.safe.backend.domain.admin.cs.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CsConsultationRequest {
    private Long userId;
    private Long adminId;
    private String memo;
}
