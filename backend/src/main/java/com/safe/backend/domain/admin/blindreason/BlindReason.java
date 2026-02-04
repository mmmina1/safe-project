package com.safe.backend.domain.admin.blindreason;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@NoArgsConstructor
@Entity
@Table(name = "BLIND_REASONS")
public class BlindReason {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "reason_id")
    private Long reasonId;

    @Column(name = "reason_name", nullable = false, length = 100)
    private String reasonName;

    @Column(name = "is_active", nullable = false)
    private Integer isActive; // 1=ON, 0=OFF

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    public static BlindReason of(String reasonName) {
        BlindReason r = new BlindReason();
        r.reasonName = reasonName;
        r.isActive = 1;
        r.createdAt = LocalDateTime.now();
        return r;
    }

    public void toggle() {
        this.isActive = (this.isActive != null && this.isActive == 1) ? 0 : 1;
    }

    public void updateName(String newName) {
        this.reasonName = newName;
    }
}
