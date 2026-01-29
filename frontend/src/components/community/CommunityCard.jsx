import React from 'react'
import { useNavigate } from 'react-router-dom'

function CommunityCard({post}) {

    const navigate = useNavigate()

    const handleClick = () => {
        navigate(`/community/${post.post_id}`)
    }

    //내용 미리보기 처리
    const previewText = post.content?.length > 100
    ? post.content.substring(0,100) + "..."
    : post.content

  return (
    <div className='post-card' onClick={() => navigate(`/community/${post.id}`)}>
        <div className='thumb'/>
            <div className='post-body'>
                <div className='post-title'>[{post.category}] {post.title}</div>
                <div className='post-preview'>{previewText}</div>

                <div className='post-meta'>
                <span>{post.created_date ? new Date(post.created_date).toLocaleDateString() : "-"}</span>     
                    <span>신고 {post.report_count}</span>
                    <span>❤ {post.like_count}</span>
                </div>
            </div>
            <div className='post-actions' onClick={(e) => e.stopPropagation()}>
                <button className='icon-btn'>신고</button>
                <button className='icon-btn'>☆</button>
            </div>
    </div>
  )
}

export default CommunityCard
