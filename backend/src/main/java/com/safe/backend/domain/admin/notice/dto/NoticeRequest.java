package com.safe.backend.domain.admin.notice.dto;

import com.safe.backend.domain.admin.notice.NoticeType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record NoticeRequest(
        @NotNull NoticeType type,
        @NotBlank @Size(min = 2, max = 100) String title,
        @NotBlank @Size(min = 2) String content
) {}
