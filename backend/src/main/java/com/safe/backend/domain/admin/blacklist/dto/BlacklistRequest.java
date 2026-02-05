package com.safe.backend.domain.admin.blacklist.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BlacklistRequest {
    private String targetValue; // 전화번호 또는 URL
    private String type; // PHONE 또는 URL
    private String reason; // 차단사유
}
