package com.safe.backend.domain.community.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class CommentUpdate {

    private String content;

    @JsonProperty("user_id")
    private Long userId;
}
