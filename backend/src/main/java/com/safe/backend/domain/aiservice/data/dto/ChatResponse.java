package com.safe.backend.domain.aiservice.data.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import java.util.List;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class ChatResponse {
    private String answer;
    private List<ChatSourceDto> sources;
    private String mode;

    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ChatSourceDto {
        private String content;
        private String source;
    }
}
