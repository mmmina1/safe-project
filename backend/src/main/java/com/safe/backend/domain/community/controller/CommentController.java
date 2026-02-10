package com.safe.backend.domain.community.controller;

import com.safe.backend.domain.community.dto.CommentCreate;
import com.safe.backend.domain.community.dto.CommentLikeRequest;
import com.safe.backend.domain.community.dto.CommentResponse;
import com.safe.backend.domain.community.dto.CommentUpdate;
import com.safe.backend.domain.community.service.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
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

    @PostMapping
    public ResponseEntity<?> createComment(@RequestBody CommentCreate dto) {
        try {
            CommentResponse response = commentService.createCommentAndReturn(dto);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (DataIntegrityViolationException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(errorBody("DB 제약 오류", e));
        } catch (RuntimeException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(errorBody("요청 오류", e));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(errorBody("서버 오류", e));
        }
    }

    @GetMapping
    public ResponseEntity<?> getComments(@RequestParam("post_id") Long postId) {
        try {
            List<CommentResponse> list = commentService.getCommentsByPostId(postId);
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
            CommentResponse response =
                    commentService.updateComment(commentId, dto.getContent(), dto.getUserId());
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(errorBody("요청 처리 실패", e));
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
            return ResponseEntity.ok(Map.of("message", "댓글이 삭제되었습니다"));
        } catch (RuntimeException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(errorBody("요청 처리 실패", e));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(errorBody("서버 오류", e));
        }
    }

    // 댓글 좋아요 토글
    @PostMapping("/{commentId}/likes")
    public ResponseEntity<?> toggleLike(
            @PathVariable Long commentId,
            @RequestBody CommentLikeRequest dto
    ) {
        try {
            CommentService.CommentLikeToggleResult result =
                    commentService.likeComment(commentId, dto.getUserId());
            return ResponseEntity.ok(result);
        } catch (RuntimeException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(errorBody("요청 오류", e));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(errorBody("서버 오류", e));
        }
    }

    private Map<String, Object> errorBody(String title, Exception e) {
        return Map.of(
                "title", title,
                "type", e.getClass().getSimpleName(),
                "message", safeMsg(e),
                "rootCause", safeMsg(root(e))
        );
    }

    private Throwable root(Throwable t) {
        Throwable cur = t;
        while (cur.getCause() != null && cur.getCause() != cur) {
            cur = cur.getCause();
        }
        return cur;
    }

    private String safeMsg(Throwable t) {
        if (t == null) return "";
        String msg = t.getMessage();
        return (msg == null || msg.isBlank()) ? t.toString() : msg;
    }
}
