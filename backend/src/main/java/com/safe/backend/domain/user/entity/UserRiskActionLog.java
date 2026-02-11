package com.safe.backend.domain.user.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_risk_action_log")
public class UserRiskActionLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "log_id")
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;      // User.userId

    @Column(name = "admin_id", nullable = false, length = 50)
    private String adminId;   // 나중에 관리자 계정 ID/이메일

    @Enumerated(EnumType.STRING)
    @Column(name = "action_type", nullable = false, length = 20)
    private UserRiskActionType actionType;

    @Column(name = "reason", length = 500)
    private String reason;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    protected UserRiskActionLog() {}

    public UserRiskActionLog(Long userId,
                             String adminId,
                             UserRiskActionType actionType,
                             String reason) {
        this.userId = userId;
        this.adminId = adminId;
        this.actionType = actionType;
        this.reason = reason;
        this.createdAt = LocalDateTime.now();
    }

    // getter 정도만 필요
    public Long getId() { return id; }
    public Long getUserId() { return userId; }
    public String getAdminId() { return adminId; }
    public UserRiskActionType getActionType() { return actionType; }
    public String getReason() { return reason; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}

