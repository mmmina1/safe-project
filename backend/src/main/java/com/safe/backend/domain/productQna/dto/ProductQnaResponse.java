package com.safe.backend.domain.productQna.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProductQnaResponse {

    private Long qnaId;
    private Long productId;
    private Long writerUserId;
    private String writerName;
    
    private String title;
    private String content;
    private Boolean isPrivate;
    
    private String status;
    private String answerContent;
    private LocalDateTime answeredAt;
    private LocalDateTime createdDate;
    private LocalDateTime updatedDate;

    
}
