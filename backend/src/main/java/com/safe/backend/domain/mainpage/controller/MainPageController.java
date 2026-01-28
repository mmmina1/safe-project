package com.safe.backend.domain.mainpage.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.safe.backend.domain.mainpage.dto.response.MainPageResponse;
import com.safe.backend.domain.mainpage.service.MainPageService;
import com.safe.backend.global.response.ApiResponse;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;


@RequiredArgsConstructor
@RestController
@RequestMapping("/api/mainpage")
public class MainPageController {
    
    private final MainPageService mainPageService;

    @GetMapping("/phishing")
    public ApiResponse<MainPageResponse> search(@RequestParam String phone){
        return ApiResponse.ok(mainPageService.searchPhishing(phone));
    }
    
    
}
