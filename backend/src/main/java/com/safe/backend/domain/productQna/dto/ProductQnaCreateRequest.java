package com.safe.backend.domain.productQna.dto;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class ProductQnaCreateRequest {

    private String title;
    private String content;
    private Boolean isPrivate;
    
}
