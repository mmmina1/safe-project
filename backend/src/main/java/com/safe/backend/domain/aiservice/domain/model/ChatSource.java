package com.safe.backend.domain.aiservice.domain.model;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ChatSource {
    private final String content;
    private final String source;
}
