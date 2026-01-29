package com.safe.backend.domain.community.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

import com.safe.backend.domain.community.entity.VisitPost;

public interface PostRepository extends JpaRepository<VisitPost,Long>, JpaSpecificationExecutor<VisitPost>{
    
    @Query("select p from VisitPost p " +
           "left join fetch p.user " +
           "where p.isHidden = false " +
           "order by p.createdDate desc")
    List<VisitPost> findAllWithUser();
    
}
