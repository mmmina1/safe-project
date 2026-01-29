package com.safe.backend.domain.community.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import com.safe.backend.domain.community.entity.VisitPost;

public interface PostRepository extends JpaRepository<VisitPost,Long>, JpaSpecificationExecutor<VisitPost>{
    
}
