package com.safe.backend.global.dto;

import lombok.Getter;
import org.springframework.data.domain.Page;

import java.util.List;

@Getter
public class PageResponse<T> {
    private final List<T> content;
    private final int page;
    private final int size;
    private final long totalElements;
    private final int totalPages;
    private final boolean first;
    private final boolean last;

    public PageResponse(Page<T> p) {
        this.content = p.getContent();
        this.page = p.getNumber();
        this.size = p.getSize();
        this.totalElements = p.getTotalElements();
        this.totalPages = p.getTotalPages();
        this.first = p.isFirst();
        this.last = p.isLast();
    }
}
