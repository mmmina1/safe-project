package com.safe.backend.domain.aiservice.data.Model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import java.util.List;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class ChatResponseModel {
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
