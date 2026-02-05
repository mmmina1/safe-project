import React from 'react'
import { useNavigate } from 'react-router-dom'

function CommunityCard({post}) {

    const navigate = useNavigate()

    const handleClick = () => {
        const pid = post.postId ?? post.post_id ?? post.id

        if (!pid) {
        console.error("게시글 ID가 없습니다. post 객체 확인:", post)
        return
        }

        navigate(`/community/${pid}`)
    }

    //내용 미리보기 처리
    const previewText = post.content_preview ?? "";

  return (
    <div className='post-card' onClick={handleClick}>
        <div className='thumb'/>
        <div className='post-body'>
            <div className='post-title'>[{post.category}] {post.title}</div>
            <div className='post-preview'>{previewText}</div>

            <div className='post-meta'>
                <span>👤 {post.name ?? (post.user_id ? `${post.name}` : "익명")}</span>
                <span>📅 {post.created_date ? new Date(post.created_date).toLocaleDateString() : "-"}</span>     
                <span>🚨 신고 {post.report_count}</span>
                <span>❤️ {post.like_count}</span>
            </div>
        </div>
        <div className='post-actions' onClick={(e) => e.stopPropagation()}>
            <button className='icon-btn'>신고</button>
            <button className='icon-btn'>❤️</button>
        </div>
    </div>
  )
}

export default CommunityCard
