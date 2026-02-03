package com.safe.backend.domain.community.controller;
import com.safe.backend.domain.community.dto.*;
import com.safe.backend.domain.community.service.CommunityService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;



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
    public VisitPostDetail getPostDetail(@PathVariable Long postId){
        return communityService.getVisitPostDetail(postId);
    }

    //작성
    @PostMapping("/posts")
    public Map<String,Object> createPost(@RequestBody VisitPostCreate req){
        Long postId = communityService.createVisitPost(req);

        return Map.of("post_id",postId);
    }
    
}
