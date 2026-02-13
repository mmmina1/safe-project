package com.safe.backend.domain.user.controller;

import com.safe.backend.domain.user.dto.*;
import com.safe.backend.domain.user.service.AdminUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/admin/users")
public class AdminUserController {

    private final AdminUserService adminUserService;

    /**
     * 관리자용 회원 검색
     */
    @GetMapping("/search")
    public ResponseEntity<List<UserAdminResponse>> searchUsers(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String status
    ) {
        UserSearchRequest request = new UserSearchRequest();
        request.setKeyword(keyword);

        if (status != null && !status.isEmpty()) {
            try {
                request.setStatus(
                        com.safe.backend.domain.user.entity.UserStatus.valueOf(status)
                );
            } catch (IllegalArgumentException e) {
                // 잘못된 status 값은 무시
            }
        }

        return ResponseEntity.ok(
                adminUserService.searchUsers(request)
        );
    }

    /**
     * 관리자용 회원 단건 조회
     */
    @GetMapping("/{userId}")
    public ResponseEntity<UserAdminResponse> getUser(@PathVariable Long userId) {
        return ResponseEntity.ok(
                adminUserService.getUserById(userId)
        );
    }

    /**
     * 회원 조치 이력 조회
     * (이건 관리자 공통 로그라 UserAdminResponse 아님)
     */
    @GetMapping("/{userId}/history")
    public ResponseEntity<List<UserActionHistoryResponse>> getUserHistory(
            @PathVariable Long userId
    ) {
        return ResponseEntity.ok(
                adminUserService.getUserActionHistory(userId)
        );
    }

    /**
     * 관리자 조치 적용
     */
    @PostMapping("/{userId}/action")
    public ResponseEntity<UserAdminResponse> applyUserAction(
            @PathVariable Long userId,
            @RequestBody UserActionRequest request
    ) {
        return ResponseEntity.ok(
                adminUserService.applyUserAction(userId, request)
        );
    }

    /**
     * 제재 해제
     */
    @PatchMapping("/{userId}/release")
    public ResponseEntity<UserAdminResponse> releaseUser(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "1") Long adminId
    ) {
        return ResponseEntity.ok(
                adminUserService.releaseUser(userId, adminId)
        );
    }
    /**
     * 전체 운영 이력 조회 (모든 유저)
     */
    @GetMapping("/history")
    public ResponseEntity<List<UserActionHistoryResponse>> getAllHistory() {
        return ResponseEntity.ok(
                adminUserService.getAllActionHistory()
        );
    }
}
