package com.safe.backend.domain.community.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class CommentList {

    private List<CommentItem> items;
    private Long total;  // 전체 댓글 개수
    
}