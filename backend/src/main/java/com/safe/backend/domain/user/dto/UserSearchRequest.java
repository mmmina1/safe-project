package com.safe.backend.domain.user.dto;

import com.safe.backend.domain.user.entity.UserStatus;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserSearchRequest {
    private String keyword;      // 이메일/이름(닉네임) 검색
    private UserStatus status;    // ACTIVE/SUSPENDED 등
}
