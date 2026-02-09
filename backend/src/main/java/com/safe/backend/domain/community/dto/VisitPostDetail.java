package com.safe.backend.domain.community.dto;

import java.time.LocalDateTime;
import com.safe.backend.domain.community.entity.VisitPost;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class VisitPostDetail {
    
    private Long postId;
    private Long userId;
    private String name;
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

    // 이 게시글을 내가 눌렀는지 여부
    private Boolean isLiked; 

    // from 메서드에서 isLiked를 받도록 수정
    public static VisitPostDetail from(VisitPost p, boolean isLiked) {
        String name = null;
        if (p.getUser() != null) {
            name = p.getUser().getName();
        }

        return new VisitPostDetail(
                p.getPostId(),
                p.getUserId(),
                name,
                p.getCategory(),
                p.getTitle(),
                p.getContent(),
                p.getVisitCount(),
                p.getLikeCount(),
                p.getReportCount(),
                p.getStatus(),
                p.getIsHidden(),
                p.getCreatedDate(),
                p.getUpdatedDate(),
                isLiked
        );
    }
}