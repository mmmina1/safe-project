package com.safe.backend.domain.aiservice.presentation.DTO;

import com.safe.backend.domain.aiservice.domain.Entity.ChatResultEntity;
import lombok.AllArgsConstructor;
import lombok.Getter;
import java.util.List;
import java.util.stream.Collectors;

@Getter
@AllArgsConstructor
public class ChatResultDTO {
    private final String answer;
    private final List<ChatSourceDTO> sources;
    private final String mode;

    public static ChatResultDTO fromEntity(ChatResultEntity entity) {
        return new ChatResultDTO(
                entity.getAnswer(),
                entity.getSources().stream()
                        .map(s -> new ChatSourceDTO(s.getContent(), s.getSource()))
                        .collect(Collectors.toList()),
                entity.getMode());
    }
}
