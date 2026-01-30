package com.safe.backend.domain.aiservice.presentation.DTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class ChatRequestDTO {
    private String message;
    private String session_id = "default_session";
    private Boolean use_rag = true;

    public ChatRequestDTO(String message, String userId) {
        this.message = message;
        this.session_id = userId != null ? userId : "default_session";
        this.use_rag = true;
    }
}
