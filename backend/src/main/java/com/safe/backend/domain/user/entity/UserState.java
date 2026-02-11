package com.safe.backend.domain.user.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_state")
public class UserState {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "state_id")
    private Long stateId;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "admin_id", nullable = false)
    private Long adminId; // 처리 관리자 ID

    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false, length = 50)
    private StateType type; // WARNING, SUSPENDED, BANNED, DELETED

    @Column(name = "reason", length = 150)
    private String reason;

    @Column(name = "state_date", nullable = false)
    private LocalDateTime stateDate; // 시작일시

    @Column(name = "end_date")
    private LocalDateTime endDate; // 종료일시

    @Column(name = "created_date", nullable = false, updatable = false)
    private LocalDateTime createdDate;

    @Column(name = "updated_date")
    private LocalDateTime updatedDate;

    @PrePersist
    protected void onCreate() {
        this.createdDate = LocalDateTime.now();
        this.updatedDate = LocalDateTime.now();
        if (this.stateDate == null) {
            this.stateDate = LocalDateTime.now();
        }
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedDate = LocalDateTime.now();
    }

    // Getters
    public Long getStateId() { return stateId; }
    public Long getUserId() { return userId; }
    public Long getAdminId() { return adminId; }
    public StateType getType() { return type; }
    public String getReason() { return reason; }
    public LocalDateTime getStateDate() { return stateDate; }
    public LocalDateTime getEndDate() { return endDate; }
    public LocalDateTime getCreatedDate() { return createdDate; }
    public LocalDateTime getUpdatedDate() { return updatedDate; }

    // Factory method
    public static UserState of(Long userId, Long adminId, StateType type, String reason) {
        UserState state = new UserState();
        state.userId = userId;
        state.adminId = adminId;
        state.type = type;
        state.reason = reason;
        state.stateDate = LocalDateTime.now();
        return state;
    }

    public void release() {
        this.endDate = LocalDateTime.now();
    }
}
