package com.safe.backend.domain.community.controller;

import com.safe.backend.domain.community.dto.CommentCreate;
import com.safe.backend.domain.community.dto.CommentResponse;
import com.safe.backend.domain.community.dto.CommentUpdate;
import com.safe.backend.domain.community.service.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/comments")
public class CommentController {

    private final CommentService commentService;

    private Map<String, Object> errorBody(String title, Exception e) {
        return Map.of("title", title, "message", e.getMessage());
    }

    @PostMapping("")
    public ResponseEntity<?> createComment(@RequestBody CommentCreate dto) {
        try {
            CommentResponse result = commentService.createCommentAndReturn(dto);
            return ResponseEntity.status(HttpStatus.CREATED).body(result);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(errorBody("요청 오류", e));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(errorBody("서버 오류", e));
        }
    }

    @GetMapping("")
    public ResponseEntity<?> getComments(
        @RequestParam("post_id") Long postId,
        @RequestParam(required = false) Long userId // userId 추가
    ) {
        try {
            // 서비스 호출 인자 수정
            List<CommentResponse> list = commentService.getCommentsByPostId(postId, userId);
            return ResponseEntity.ok(list);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(errorBody("서버 오류", e));
        }
    }

    @PutMapping("/{commentId}")
    public ResponseEntity<?> updateComment(
            @PathVariable Long commentId,
            @RequestBody CommentUpdate dto
    ) {
        try {
            CommentResponse result = commentService.updateComment(commentId, dto.getContent(), dto.getUserId());
            return ResponseEntity.ok(result);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(errorBody("요청 오류", e));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(errorBody("서버 오류", e));
        }
    }

    @DeleteMapping("/{commentId}")
    public ResponseEntity<?> deleteComment(
            @PathVariable Long commentId,
            @RequestParam("user_id") Long userId
    ) {
        try {
            commentService.deleteComment(commentId, userId);
            return ResponseEntity.ok(Map.of("message", "삭제 성공"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(errorBody("요청 오류", e));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(errorBody("서버 오류", e));
        }
    }

    @PostMapping("/{commentId}/like")
    public ResponseEntity<?> likeComment(
            @PathVariable Long commentId,
            @RequestBody Map<String, Long> body
    ) {
        try {
            Long userId = body.get("userId");
            var result = commentService.likeComment(commentId, userId);
            return ResponseEntity.ok(result);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(errorBody("요청 오류", e));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(errorBody("서버 오류", e));
        }
    }
}