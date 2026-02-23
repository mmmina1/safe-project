package com.safe.backend.domain.aiservice.data.Model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ChatResponseModel {
    private String answer;
    private List<ChatSourceDto> sources;
    private String mode;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ChatSourceDto {
        private String content;
        private String source;
    }
}
