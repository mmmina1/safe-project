package com.safe.backend.domain.community.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import com.safe.backend.domain.community.entity.Comment;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {
    
    /**
     * 특정 게시글의 모든 댓글 조회
     * JPQL 대신 네이티브 쿼리에 가까운 필드 매핑으로 500 에러 차단
     */
    @Query("SELECT c FROM Comment c " +
           "LEFT JOIN FETCH c.user " +
           "WHERE c.postId = :postId " +
           "AND c.isDeleted = false " +
           "ORDER BY c.createdDate ASC")
    List<Comment> findAllByPostIdWithUser(@Param("postId") Long postId);
    
    /**
     * 부모 댓글만 조회 (대댓글 제외)
     * parentCommentId 필드명이 엔티티와 정확히 일치해야 합니다
     */
    @Query("SELECT c FROM Comment c " +
           "LEFT JOIN FETCH c.user " +
           "WHERE c.postId = :postId " +
           "AND c.parentCommentId IS NULL " +
           "AND c.isDeleted = false " +
           "ORDER BY c.createdDate ASC")
    List<Comment> findParentCommentsByPostId(@Param("postId") Long postId);
    
    /**
     * 특정 댓글의 대댓글 조회
     */
    @Query("SELECT c FROM Comment c " +
           "LEFT JOIN FETCH c.user " +
           "WHERE c.parentCommentId = :parentCommentId " +
           "AND c.isDeleted = false " +
           "ORDER BY c.createdDate ASC")
    List<Comment> findRepliesByParentId(@Param("parentCommentId") Long parentCommentId);
    
    /**
     * 댓글 개수 카운트
     */
    @Query("SELECT COUNT(c) FROM Comment c " +
           "WHERE c.postId = :postId " +
           "AND c.isDeleted = false")
    Long countByPostId(@Param("postId") Long postId);
}