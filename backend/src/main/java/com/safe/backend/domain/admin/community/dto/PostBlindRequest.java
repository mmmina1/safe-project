package com.safe.backend.domain.admin.community.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PostBlindRequest {
    private Long postId;
    private Long blindReasonId;
    private Long adminId;
}
