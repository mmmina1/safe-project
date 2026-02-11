package com.safe.backend.domain.aiservice.domain.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ChatSourceEntity {
    private final String content;
    private final String source;
}
