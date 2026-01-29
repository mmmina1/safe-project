package com.safe.backend.domain.community.dto;

import java.time.LocalDateTime;

import com.safe.backend.domain.community.entity.VisitPost;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class VisitPostDetail{
    
    private Long postId;
    private Long userId;
    private String category;
    private String title;
    private String content;

    private Integer visitCount;
    private Integer likeCount;
    private Integer reportCount;

    private VisitPost.Status status;
    private Boolean isHidden;

    private LocalDateTime createdDate;
    private LocalDateTime updatedDate;

    public static VisitPostDetail from(VisitPost p) {
        return new VisitPostDetail(
                p.getPostId(),
                p.getUserId(),
                p.getCategory(),
                p.getTitle(),
                p.getContent(),
                p.getVisitCount(),
                p.getLikeCount(),
                p.getReportCount(),
                p.getStatus(),
                p.getIsHidden(),
                p.getCreatedDate(),
                p.getUpdatedDate()
        );

    }
}