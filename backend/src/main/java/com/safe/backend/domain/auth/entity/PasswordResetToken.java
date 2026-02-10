package com.safe.backend.domain.auth.entity;

import com.safe.backend.domain.user.entity.User;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "password_reset_tokens")
public class PasswordResetToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "token", nullable = false, unique = true, length = 255)
    private String token;

    @Column(name = "expires_at", nullable = false)
    private LocalDateTime expiresAt;

    @Column(name = "used", nullable = false)
    private boolean used = false;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    protected PasswordResetToken() {
    }

    private PasswordResetToken(User user, String token, LocalDateTime expiresAt) {
        this.user = user;
        this.token = token;
        this.expiresAt = expiresAt;
    }

    public static PasswordResetToken create(User user, String token, long expireMinutes) {
        LocalDateTime now = LocalDateTime.now();
        return new PasswordResetToken(user, token, now.plusMinutes(expireMinutes));
    }

    // === 비즈니스 메서드 ===
    public boolean isExpired() {
        return LocalDateTime.now().isAfter(expiresAt);
    }

    public void markUsed() {
        this.used = true;
    }

    // === getter들 ===
    public User getUser() {
        return user;
    }

    public boolean isUsed() {
        return used;
    }
}