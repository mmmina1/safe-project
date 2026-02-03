package com.safe.backend.domain.community.service;

import com.safe.backend.domain.community.entity.Comment;
import com.safe.backend.domain.community.repository.CommentRepository;
import com.safe.backend.domain.community.dto.CommentCreate;
import com.safe.backend.domain.community.dto.CommentResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class CommentService {
    private final CommentRepository commentRepository;

    @Transactional
    public CommentResponse createCommentAndReturn(CommentCreate dto) {
        // 🔥 빌더 안 쓰고 기존 create 메서드 활용!
        // 파라미터 순서 주의: (postId, userId, content, likeCount, isDeleted) 
        // 형님 엔티티의 create 메서드 파라미터 순서에 맞춰서 0과 false를 넣어주세요.
        Comment comment = Comment.create(
            dto.getPost_id(), 
            dto.getUser_id() != null ? dto.getUser_id() : 1L, 
            dto.getContent()
            // 만약 여기서 에러나면 Comment.java의 create 메서드 파라미터에 0(likeCount)을 추가해야 합니다!
        );
        
        Comment savedComment = commentRepository.save(comment);
        return CommentResponse.from(savedComment);
    }

    public List<CommentResponse> getCommentsByPostId(Long postId) {
        return commentRepository.findAllByPostIdWithUser(postId).stream()
                .map(CommentResponse::from)
                .toList();
    }
}