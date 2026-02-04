package com.safe.backend.domain.admin.banner;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BannerRepository extends JpaRepository<Banner, Long> {
    List<Banner> findByIsActiveOrderByDisplayOrderAsc(Integer isActive);
    
    @Query("SELECT MAX(b.displayOrder) FROM Banner b")
    Integer findMaxDisplayOrder();
}
