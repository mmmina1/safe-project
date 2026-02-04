package com.safe.backend.domain.user.dto;

import com.safe.backend.domain.user.entity.StateType;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserActionRequest {
    private StateType type;  // WARNING, SUSPENDED, BANNED
    private String reason;
    private Long adminId;
}
