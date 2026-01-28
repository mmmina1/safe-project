package com.safe.backend.domain.aiservice.data.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class ChatRequest {
    private String message;
    private String session_id = "default_session";
    private Boolean use_rag = true;

    public ChatRequest(String message, String userId) {
        this.message = message;
        this.session_id = userId != null ? userId : "default_session";
        this.use_rag = true;
    }
}
