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

    @GetMapping("/search")
    public ResponseEntity<List<UserResponse>> searchUsers(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String status
    ) {
        UserSearchRequest request = new UserSearchRequest();
        request.setKeyword(keyword);
        if (status != null && !status.isEmpty()) {
            try {
                request.setStatus(com.safe.backend.domain.user.entity.UserStatus.valueOf(status));
            } catch (IllegalArgumentException e) {
                // 잘못된 status 값은 무시
            }
        }

        List<UserResponse> users = adminUserService.searchUsers(request);
        return ResponseEntity.ok(users);
    }

    @GetMapping("/agents")
    public ResponseEntity<List<UserResponse>> getAgents() {
        return ResponseEntity.ok(adminUserService.getAgents());
    }

    @GetMapping("/{userId}")
    public ResponseEntity<UserResponse> getUser(@PathVariable Long userId) {
        return ResponseEntity.ok(adminUserService.getUserById(userId));
    }

    @GetMapping("/{userId}/history")
    public ResponseEntity<List<UserActionHistoryResponse>> getUserHistory(@PathVariable Long userId) {
        return ResponseEntity.ok(adminUserService.getUserActionHistory(userId));
    }

    @PostMapping("/{userId}/action")
    public ResponseEntity<UserResponse> applyUserAction(
            @PathVariable Long userId,
            @RequestBody UserActionRequest request
    ) {
        return ResponseEntity.ok(adminUserService.applyUserAction(userId, request));
    }

    @PatchMapping("/{userId}/release")
    public ResponseEntity<UserResponse> releaseUser(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "1") Long adminId
    ) {
        try {
            return ResponseEntity.ok(adminUserService.releaseUser(userId, adminId));
        } catch (IllegalArgumentException e) {
            throw e; // GlobalExceptionHandler가 처리
        } catch (Exception e) {
            System.err.println("[AdminUserController] releaseUser 예외 발생:");
            System.err.println("  userId: " + userId);
            System.err.println("  adminId: " + adminId);
            e.printStackTrace();
            throw new RuntimeException("회원 활성화 중 오류가 발생했습니다: " + e.getMessage(), e);
        }
    }

    @DeleteMapping("/{userId}")
    public ResponseEntity<Void> deleteUser(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "1") Long adminId
    ) {
        try {
            adminUserService.deleteUser(userId, adminId);
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            throw e; // GlobalExceptionHandler가 처리
        } catch (Exception e) {
            System.err.println("[AdminUserController] deleteUser 예외 발생:");
            System.err.println("  userId: " + userId);
            System.err.println("  adminId: " + adminId);
            e.printStackTrace();
            throw new RuntimeException("회원 삭제 중 오류가 발생했습니다: " + e.getMessage(), e);
        }
    }

    @PatchMapping("/{userId}/restore")
    public ResponseEntity<UserResponse> restoreUser(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "1") Long adminId
    ) {
        return ResponseEntity.ok(adminUserService.restoreUser(userId, adminId));
    }
}
