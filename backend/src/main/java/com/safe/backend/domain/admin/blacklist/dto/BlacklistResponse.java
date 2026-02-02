package com.safe.backend.domain.admin.blacklist.dto;

import com.safe.backend.domain.admin.blacklist.Blacklist;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class BlacklistResponse {
    private Long blacklistId;
    private String targetValue;
    private String type;
    private Integer reportCount;
    private Integer voiceReportCnt;
    private Integer smsReportCnt;
    private LocalDateTime lastReportedAt;
    private String reason;
    private Integer isActive;
    private LocalDateTime createdDate;

    public BlacklistResponse(Blacklist blacklist) {
        this.blacklistId = blacklist.getBlacklistId();
        this.targetValue = blacklist.getTargetValue();
        this.type = blacklist.getType();
        this.reportCount = blacklist.getReportCount();
        this.voiceReportCnt = blacklist.getVoiceReportCnt();
        this.smsReportCnt = blacklist.getSmsReportCnt();
        this.lastReportedAt = blacklist.getLastReportedAt();
        this.reason = blacklist.getReason();
        this.isActive = blacklist.getIsActive();
        this.createdDate = blacklist.getCreatedDate();
    }
}
