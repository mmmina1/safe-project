package com.safe.backend.domain.aiservice.presentation.DTO;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ChatSourceDTO {
    private final String content;
    private final String source;
}
