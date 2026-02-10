package com.safe.backend.domain.aiservice.domain.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import java.time.LocalDateTime;

/**
 * ChatMessageEntity: 도메인 계층에서 다루는 순수한 대화 메시지 객체
 */
@Getter
@AllArgsConstructor
public class ChatMessageEntity {
    private final String role;
    private final String content;
    private final LocalDateTime timestamp;
}
