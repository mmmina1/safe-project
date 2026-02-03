package com.safe.backend.domain.community.controller;

import com.safe.backend.domain.community.dto.CommentCreate;
import com.safe.backend.domain.community.dto.CommentResponse;
import com.safe.backend.domain.community.service.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/comments")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class CommentController {
    
    private final CommentService commentService;

    // 댓글 등록
    @PostMapping
    public ResponseEntity<CommentResponse> createComment(@RequestBody CommentCreate dto) {
        CommentResponse response = commentService.createCommentAndReturn(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // 댓글 조회
    @GetMapping
    public ResponseEntity<List<CommentResponse>> getComments(@RequestParam("post_id") Long postId) {
        return ResponseEntity.ok(commentService.getCommentsByPostId(postId));
    }

    // 🔥 댓글 수정
    @PutMapping("/{commentId}")
    public ResponseEntity<?> updateComment(
            @PathVariable Long commentId,
            @RequestBody Map<String, Object> payload) {
        
        try {
            String content = (String) payload.get("content");
            Long userId = ((Number) payload.get("user_id")).longValue();
            
            CommentResponse response = commentService.updateComment(commentId, content, userId);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // 🔥 댓글 삭제
    @DeleteMapping("/{commentId}")
    public ResponseEntity<?> deleteComment(
            @PathVariable Long commentId,
            @RequestParam("user_id") Long userId) {
        
        try {
            commentService.deleteComment(commentId, userId);
            return ResponseEntity.ok(Map.of("message", "댓글이 삭제되었습니다"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", e.getMessage()));
        }
    }
}