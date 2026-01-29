package com.safe.backend.domain.community.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class VisitPostList {

    private List<VisitPostItem> items;
    private int page;
    private int size;
    private Long total;
    
}
