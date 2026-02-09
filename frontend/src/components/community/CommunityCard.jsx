import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function CommunityCard({post}) {

    const navigate = useNavigate()
    
    // 좋아요 상태 (로컬 상태로만 관리, 백엔드 API 없음)
    const [liked, setLiked] = useState(false)
    const [likeCount, setLikeCount] = useState(post.likeCount || 0)

    const handleClick = () => {
        const pid = post.postId ?? post.post_id ?? post.id

        if (!pid) {
            console.error("게시글 ID가 없습니다. post 객체 확인:", post)
            return
        }

        navigate(`/community/${pid}`)
    }

    // 좋아요 토글 (백엔드 API 필요)
    const handleLike = (e) => {
        e.stopPropagation(); // 카드 클릭 방지

        // TODO: 백엔드 API 연결 필요
        // const result = await communityApi.togglePostLike(postId, userId);
        
        // 임시: 로컬에서만 토글
        if (!liked) {
            setLiked(true);
            setLikeCount(likeCount + 1);
        } else {
            setLiked(false);
            setLikeCount(likeCount - 1);
        }
    };

    //내용 미리보기 처리
    const previewText = post.content_preview ?? post.contentPreview ?? "";

  return (
    <div className='post-card' onClick={handleClick}>
        <div className='thumb'/>
        <div className='post-body'>
            <div className='post-title'>[{post.category}] {post.title}</div>
            <div className='post-preview'>{previewText}</div>

            <div className='post-meta'>
                <span>👤 {post.name || "익명"}</span>
                <span>📅 {post.createdDate ? post.createdDate.split('T')[0] : "-"}</span>
            </div>
        </div>
        <div className='post-actions' onClick={(e) => e.stopPropagation()}>
            <button className='icon-btn'>신고</button>
            <button 
                className='icon-btn' 
                onClick={handleLike}
                style={{
                    color: liked ? "#ff4d4f" : "#666",
                    fontWeight: liked ? "800" : "normal"
                }}
            >
                {liked ? "❤️" : "🤍"} {likeCount}
            </button>
        </div>
    </div>
  )
}

export default CommunityCard