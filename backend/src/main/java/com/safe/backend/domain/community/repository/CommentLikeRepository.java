package com.safe.backend.domain.community.repository;

import com.safe.backend.domain.community.entity.CommentLike; // 🔥 이 경로가 맞아야 함
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface CommentLikeRepository extends JpaRepository<CommentLike, Long> {
    Optional<CommentLike> findByCommentIdAndUserId(Long commentId, Long userId);
}