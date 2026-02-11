package com.safe.backend.domain.user.dto;


import com.safe.backend.domain.user.entity.UserRiskActionLog;
import com.safe.backend.domain.user.entity.UserRiskActionType;

import java.time.LocalDateTime;

public class UserRiskActionLogResponse {

    private Long id;
    private LocalDateTime time;
    private String admin;
    private UserRiskActionType action;
    private Long target;
    private String reason;

    public UserRiskActionLogResponse(Long id, LocalDateTime time, String admin,
                                     UserRiskActionType action, Long target, String reason) {
        this.id = id;
        this.time = time;
        this.admin = admin;
        this.action = action;
        this.target = target;
        this.reason = reason;
    }

    public static UserRiskActionLogResponse from(UserRiskActionLog log) {
        return new UserRiskActionLogResponse(
                log.getId(),
                log.getCreatedAt(),
                log.getAdminId(),
                log.getActionType(),
                log.getUserId(),
                log.getReason()
        );
    }

    public Long getId() { return id; }
    public LocalDateTime getTime() { return time; }
    public String getAdmin() { return admin; }
    public UserRiskActionType getAction() { return action; }
    public Long getTarget() { return target; }
    public String getReason() { return reason; }
}
