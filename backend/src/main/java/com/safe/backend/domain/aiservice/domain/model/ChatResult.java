package com.safe.backend.domain.aiservice.domain.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import java.util.List;

@Getter
@AllArgsConstructor
public class ChatResult {
    private final String answer;
    private final List<ChatSource> sources;
    private final String mode;
}
