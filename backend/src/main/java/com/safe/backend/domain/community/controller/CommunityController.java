package com.safe.backend.domain.community.controller;
import com.safe.backend.domain.community.dto.*;
import com.safe.backend.domain.community.service.CommunityService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Map;



@RestController
@RequiredArgsConstructor
@RequestMapping("/api/community")
public class CommunityController {

    private final CommunityService communityService;

    //목록 
    @GetMapping("/posts")
    public VisitPostList getPosts(
        @RequestParam(required = false) String query,
        @RequestParam(required = false) String category,
        @RequestParam(defaultValue = "recent") String sort,
        @RequestParam(defaultValue = "1") int page,
        @RequestParam(defaultValue = "10") int size
    ){
        return communityService.getVisitPosts(query, category, sort, page, size);
    }

    //상세
    @GetMapping("/posts/{postId}")
    public VisitPostDetail getPostDetail(
        @PathVariable Long postId, 
        @RequestParam(required = false) Long userId // 이거 추가해서 프론트에서 ID 받아야 함
    ){
        // 서비스 호출할 때 userId도 같이 던져줌
        return communityService.getVisitPostDetail(postId, userId);
    }

    //작성
    @PostMapping("/posts")
    public Map<String,Object> createPost(@RequestBody VisitPostCreate req){
        Long postId = communityService.createVisitPost(req);

        return Map.of("post_id",postId);
    }
    
}