package com.safe.backend.domain.mainpage.service;

import java.time.LocalDateTime;

import org.springframework.stereotype.Service;

import com.safe.backend.domain.mainpage.dto.response.MainPageResponse;

@Service
public class MainPageService {

    public MainPageResponse searchPhishing(String phone){

        //더미 데이터
        int voice = 0;
        int sms = 5;
        int total = voice + sms;

        LocalDateTime to = LocalDateTime.now();
        LocalDateTime from = to.minusMonths(3);

        return new MainPageResponse(phone, total, voice, sms, "최근 3개월", from, to);
    }
    
}
