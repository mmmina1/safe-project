package com.safe.backend.domain.user.dto;

import com.safe.backend.domain.user.entity.User;
import com.safe.backend.domain.user.entity.UserRole;
import com.safe.backend.domain.user.entity.UserStatus;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class UserResponse {
    private Long userId;
    private String email;
    private String name; // 닉네임/이름
    private UserStatus status;
    private UserRole role;
    private LocalDateTime createdDate;
    private LocalDateTime lastLoginAt;

    public UserResponse(User user) {
        this.userId = user.getUserId();
        this.email = user.getEmail();
        this.name = user.getName();
        this.status = user.getStatus();
        this.role = user.getRole();
        this.createdDate = user.getCreatedDate();
        this.lastLoginAt = user.getLastLoginAt();
    }
}
