package com.safe.backend.domain.community.controller;

import com.safe.backend.domain.community.dto.CommentCreate;
import com.safe.backend.domain.community.dto.CommentResponse;
import com.safe.backend.domain.community.service.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/comments")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class CommentController {
    
    private final CommentService commentService;

    // 댓글 등록
    @PostMapping
    public ResponseEntity<CommentResponse> createComment(@RequestBody CommentCreate dto) {
        // 서비스에서 DB 에러(like_count 등)를 처리한 후 결과를 받아옵니다.
        CommentResponse response = commentService.createCommentAndReturn(dto);
        // 정상적으로 등록되면 201 Created 응답을 보냅니다.
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // 댓글 조회
    @GetMapping
    public ResponseEntity<List<CommentResponse>> getComments(@RequestParam("post_id") Long postId) {
        return ResponseEntity.ok(commentService.getCommentsByPostId(postId));
    }
}