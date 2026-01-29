package com.safe.backend.domain.community.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class VisitPostCreate {
    
    //users table과 매칭
    private Long userId;

    //visit_post table
    private String category;
    private String title;
    private String content;

}
