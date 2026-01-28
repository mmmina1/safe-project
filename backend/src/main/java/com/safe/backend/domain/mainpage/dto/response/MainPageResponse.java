package com.safe.backend.domain.mainpage.dto.response;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class MainPageResponse {

    private String phone;
    private int totalCount;
    private int voiceCount;
    private int smsCount;

    private String peridLabel;
    private LocalDateTime periodFrom;
    private LocalDateTime perioddTo;
    
}
