package com.safe.backend.domain.aiservice.data.Model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class ChatRequestModel {
    private String message;
    private String session_id;
    private Boolean use_rag = true;

    public ChatRequestModel(String message, String userId) {
        this.message = message;
        this.session_id = userId != null ? userId : "-1";
        this.use_rag = true;
    }
}
