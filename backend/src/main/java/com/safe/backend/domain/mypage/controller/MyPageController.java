package com.safe.backend.domain.mypage.controller;

import com.safe.backend.domain.mypage.dto.MypageDashboardResponse;
import com.safe.backend.domain.mypage.service.MyPageService;
import com.safe.backend.domain.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/mypage")
@RequiredArgsConstructor
public class MyPageController {

    private final MyPageService myPageService;

    @GetMapping("/dashboard")
    public ResponseEntity<MypageDashboardResponse> getDashboard(@AuthenticationPrincipal Object principal) {
        // JwtAuthenticationFilter에서 User 객체를 넣어줬으므로 안전하게 캐스팅 가능
        User user = (User) principal;

        // User 객체에서 이메일을 꺼내 서비스에 전달
        return ResponseEntity.ok(myPageService.getDashboardData(user.getEmail()));
    }
}