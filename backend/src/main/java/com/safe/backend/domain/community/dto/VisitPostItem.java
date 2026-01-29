package com.safe.backend.domain.community.dto;

import java.time.LocalDateTime;

import com.safe.backend.domain.community.entity.VisitPost;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class VisitPostItem {

    private Long postId;
    private String category;
    private String title;
    private String contentPreview;

    private Integer visitCount;
    private Integer likeCount;
    private Integer reportCount;

    private VisitPost.Status status;
    private LocalDateTime createdDate;

    //목록에서는 content 전체 보내지 않고, preview만 보내기
    public static VisitPostItem from(VisitPost p) {
        String preview = p.getContent();
        if(preview!=null && preview.length() > 80){
            preview = preview.substring(0,80);
        }
        return new VisitPostItem(
            p.getPostId(),
            p.getCategory(),
            p.getTitle(),
            preview,
            p.getVisitCount(),
            p.getLikeCount(),
            p.getReportCount(),
            p.getStatus(),
            p.getCreatedDate()
        );
    }
}
