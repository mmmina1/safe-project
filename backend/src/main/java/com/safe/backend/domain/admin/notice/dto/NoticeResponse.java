package com.safe.backend.domain.admin.notice.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.safe.backend.domain.admin.notice.Notice;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class NoticeResponse {

    private final Long noticeId;
    private final String type;        
    private final String title;
    private final String content;
    @JsonProperty("isActive")
    private final boolean isActive;  
    private final boolean published; 
    private final LocalDateTime createdAt;

    public NoticeResponse(Notice n) {
        this.noticeId = n.getNoticeId();
        this.type = n.getNoticeType() != null ? n.getNoticeType().name() : "GENERAL";
        this.title = n.getTitle() != null ? n.getTitle() : "";
        this.content = n.getContent() != null ? n.getContent() : "";
        this.isActive = n.getIsActive() != null && n.getIsActive() == 1;
        this.published = n.getPublishedYn() != null && n.getPublishedYn() == 1;
        this.createdAt = n.getCreatedAt();
    }
}
