package com.safe.backend.domain.user.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
public class User {

    /* ===============================
       PK
    =============================== */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Long userId;

    /* ===============================
       기본 정보
    =============================== */
    @Column(nullable = false, unique = true, length = 255)
    private String email;

    @Column(nullable = false, length = 50)
    private String name; // 닉네임/이름(필수) - DB 스키마에 따르면 name이 닉네임/이름 역할

    @Column(name = "password_hash", nullable = true, length = 255)
    private String passwordHash;

    /* ===============================
       상태 / 권한
    =============================== */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserStatus status = UserStatus.ACTIVE;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserRole role = UserRole.USER;

    /* ===============================
       부가 정보
    =============================== */
    @Column(name = "profile_image", length = 255)
    private String profileImage;

    @Column(name = "last_login_at")
    private LocalDateTime lastLoginAt;

    @Column(name = "email_verified_at")
    private LocalDateTime emailVerifiedAt; // DB에는 email_vertified_at으로 오타가 있지만 email_verified_at 사용

    /* ===============================
       날짜 관리
    =============================== */
    @Column(name = "created_date", updatable = false)
    private LocalDateTime createdDate;

    @Column(name = "updated_date")
    private LocalDateTime updatedDate;

    /* ===============================
       생성자
    =============================== */

    // JPA 기본 생성자 (필수)
    protected User() {
    }

    // 회원가입용 생성자
    public User(String email, String name, String passwordHash) {
        this.email = email;
        this.name = name;
        this.passwordHash = passwordHash;
        this.status = UserStatus.ACTIVE;
        this.role = UserRole.USER;
    }

    /* ===============================
       JPA 라이프사이클
    =============================== */
    @PrePersist
    protected void onCreate() {
        this.createdDate = LocalDateTime.now();
        this.updatedDate = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedDate = LocalDateTime.now();
    }

    /* ===============================
       Getter (Setter는 최소화)
    =============================== */

    public Long getUserId() {
        return userId;
    }

    public String getEmail() {
        return email;
    }

    public String getName() {
        return name;
    }

    public String getPasswordHash() {
        return passwordHash;
    }

    public UserStatus getStatus() {
        return status;
    }

    public UserRole getRole() {
        return role;
    }

    public LocalDateTime getLastLoginAt() {
        return lastLoginAt;
    }

    public LocalDateTime getEmailVerifiedAt() {
        return emailVerifiedAt;
    }

    public LocalDateTime getCreatedDate() {
        return createdDate;
    }

    public LocalDateTime getUpdatedDate() {
        return updatedDate;
    }

    // Setters for admin operations
    public void setStatus(UserStatus status) {
        this.status = status;
    }
    public void changePassword(String encodedPassword) {
        this.passwordHash = encodedPassword;
    }
}
