package com.safe.backend.domain.user.dto;

import com.safe.backend.domain.user.entity.UserRiskActionType;

public class UserRiskActionRequest {

    private UserRiskActionType actionType;
    private String reason;

    public UserRiskActionType getActionType() {
        return actionType;
    }

    public String getReason() {
        return reason;
    }
}
