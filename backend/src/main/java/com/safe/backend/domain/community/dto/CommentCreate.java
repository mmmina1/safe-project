package com.safe.backend.domain.community.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CommentCreate {
    private Long post_id;
    private Long user_id;
    private String content;
    private Long parent_comment_id; // 서비스에서 getParent_comment_id()로 호출됨
}