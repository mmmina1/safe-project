package com.safe.backend.domain.user.dto;

import com.safe.backend.domain.user.entity.*;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class UserAdminResponse {

    private Long userId;
    private String email;
    private String name;

    private UserStatus status;
    private UserRole role;

    private LocalDateTime lastLoginAt;
    private LocalDateTime createdDate;

    private UserAdminResponse(Long userId, String email, String name,
                              UserStatus status, UserRole role,
                              LocalDateTime lastLoginAt, LocalDateTime createdDate) {
        this.userId = userId;
        this.email = email;
        this.name = name;
        this.status = status;
        this.role = role;
        this.lastLoginAt = lastLoginAt;
        this.createdDate = createdDate;
    }

    public static UserAdminResponse from(User user) {
        return new UserAdminResponse(
                user.getUserId(),
                user.getEmail(),
                user.getName(),
                user.getStatus(),
                user.getRole(),
                user.getLastLoginAt(),
                user.getCreatedDate()
        );
    }
}
