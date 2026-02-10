package com.safe.backend.domain.admin.blacklist;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@NoArgsConstructor
@Entity
@Table(name = "blacklist_history")
public class BlacklistHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "history_id")
    private Long historyId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "blacklist_id", nullable = false, foreignKey = @ForeignKey(value = ConstraintMode.NO_CONSTRAINT))
    private Blacklist blacklist;

    @Column(name = "action_type", nullable = false, length = 20)
    private String actionType; // CREATE, UPDATE, DELETE

    @Column(name = "admin_id")
    private Long adminId;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    public static BlacklistHistory of(Blacklist blacklist, String actionType, Long adminId) {
        BlacklistHistory history = new BlacklistHistory();
        history.blacklist = blacklist;
        history.actionType = actionType;
        history.adminId = adminId;
        return history;
    }
}
