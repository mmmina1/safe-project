package com.safe.backend.domain.community.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class CommentUpdate {
    private String content;
    private Long userId;
}
