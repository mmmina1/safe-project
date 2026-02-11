package com.safe.backend.domain.user.dto;

import com.safe.backend.domain.user.entity.StateType;
import com.safe.backend.domain.user.entity.User;
import com.safe.backend.domain.user.entity.UserState;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class UserActionHistoryResponse {
    private Long stateId;
    private Long userId;
    private StateType type;
    private String reason;
    private Long adminId;
    private LocalDateTime stateDate;
    private LocalDateTime endDate;
    private LocalDateTime createdDate;
    private String userEmail;

    public UserActionHistoryResponse(UserState state, User user) {
        this.stateId = state.getStateId();
        this.userId = state.getUserId();
        this.userEmail = user != null ? user.getEmail() : null;
        this.type = state.getType();
        this.reason = state.getReason();
        this.adminId = state.getAdminId();
        this.stateDate = state.getStateDate();
        this.endDate = state.getEndDate();
        this.createdDate = state.getCreatedDate();
    }
}
