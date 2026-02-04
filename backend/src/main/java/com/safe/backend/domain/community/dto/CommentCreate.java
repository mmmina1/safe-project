package com.safe.backend.domain.community.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter
@NoArgsConstructor
public class CommentCreate {

    // 🔥 리액트의 'post_id'를 자바의 'postId'로 자동 매핑
    @JsonProperty("post_id")
    private Long post_id;

    // 🔥 리액트의 'user_id'를 자바의 'userId'로 자동 매핑
    @JsonProperty("user_id")
    private Long user_id;

    private String content;
    
    // 부모 댓글 ID (대댓글용, 선택 사항)
    @JsonProperty("parent_comment_id")
    private Long parentCommentId;
}