package com.safe.backend.domain.aiservice.domain.Entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import java.util.List;

@Getter
@AllArgsConstructor
public class ChatResultEntity {
    private final String answer;
    private final List<ChatSourceEntity> sources;
    private final String mode;
}
