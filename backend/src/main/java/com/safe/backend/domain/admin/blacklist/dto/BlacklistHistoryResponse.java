package com.safe.backend.domain.admin.blacklist.dto;

import com.safe.backend.domain.admin.blacklist.BlacklistHistory;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class BlacklistHistoryResponse {
    private Long historyId;
    private Long blacklistId;
    private String actionType;
    private Long adminId;
    private LocalDateTime createdAt;

    public BlacklistHistoryResponse(BlacklistHistory history) {
        this.historyId = history.getHistoryId();
        this.blacklistId = history.getBlacklist().getBlacklistId();
        this.actionType = history.getActionType();
        this.adminId = history.getAdminId();
        this.createdAt = history.getCreatedAt();
    }
}
