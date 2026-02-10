package com.safe.backend.domain.mypage.controller;

import com.safe.backend.domain.mypage.dto.MypageDashboardResponse;
import com.safe.backend.domain.mypage.dto.NicknameUpdateRequest;
import com.safe.backend.domain.mypage.dto.PasswordUpdateRequest;
import com.safe.backend.domain.mypage.service.MyPageService;
import com.safe.backend.domain.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/mypage")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class MyPageController {

    private final MyPageService myPageService;

    @GetMapping("/dashboard")
    public ResponseEntity<MypageDashboardResponse> getDashboard(@AuthenticationPrincipal Object principal) {
        User user = (User) principal;
        return ResponseEntity.ok(myPageService.getDashboardData(user.getEmail()));
    }

    @PatchMapping("/nickname")
    public ResponseEntity<Void> updateNickname(
            @AuthenticationPrincipal Object principal,
            @RequestBody NicknameUpdateRequest request) {
        User user = (User) principal;
        myPageService.updateNickname(user.getEmail(), request.getNickname());
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/password")
    public ResponseEntity<Void> updatePassword(
            @AuthenticationPrincipal Object principal,
            @RequestBody PasswordUpdateRequest request) {
        User user = (User) principal;
        myPageService.updatePassword(user.getEmail(), request.getCurrentPassword(), request.getNewPassword());
        return ResponseEntity.ok().build();
    }
}