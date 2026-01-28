package com.safe.backend.domain.auth.entity;

import com.safe.backend.domain.user.entity.User;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "auth_accounts",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_auth_accounts_provider_user",
                        columnNames = {"provider", "provider_user_id"}
                )
        }
)
public class AuthAccount {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "auth_id")
    private Long authId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(name = "provider", nullable = false, length = 20)
    private AuthProvider provider;

    // Google: sub, Kakao: id, Local: email 등
    @Column(name = "provider_user_id", nullable = false, length = 255)
    private String providerUserId;

    @Column(name = "created_date", nullable = false, updatable = false)
    private LocalDateTime createdDate;

    @PrePersist
    protected void onCreate() {
        if (this.createdDate == null) {
            this.createdDate = LocalDateTime.now();
        }
    }

    // ===== 기본 생성자 =====
    protected AuthAccount() {
    }

    // ===== 정적 팩토리 메서드 =====
    public static AuthAccount createLocal(User user) {
        AuthAccount account = new AuthAccount();
        account.user = user;
        account.provider = AuthProvider.LOCAL;
        // LOCAL에서는 email을 provider_user_id로 사용 (필요하면 변경 가능)
        account.providerUserId = user.getEmail();
        return account;
    }

    public static AuthAccount createSocial(User user, AuthProvider provider, String providerUserId) {
        AuthAccount account = new AuthAccount();
        account.user = user;
        account.provider = provider;
        account.providerUserId = providerUserId;
        return account;
    }

    // ===== getter / setter =====

    public Long getAuthId() {
        return authId;
    }

    public User getUser() {
        return user;
    }

    public AuthProvider getProvider() {
        return provider;
    }

    public String getProviderUserId() {
        return providerUserId;
    }

    public LocalDateTime getCreatedDate() {
        return createdDate;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public void setProvider(AuthProvider provider) {
        this.provider = provider;
    }

    public void setProviderUserId(String providerUserId) {
        this.providerUserId = providerUserId;
    }
}