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
                {/* 캘린더 아이콘 옆에 백엔드 날짜 데이터(createdDate) 연결 */}
                <span>📅 {post.createdDate ? post.createdDate.split('T')[0] : "-"}</span>
                
                {/* 메타 정보 줄에 있던 '신고', '하트' 아이콘만 제거했습니다. */}
            </div>
        </div>
        <div className='post-actions' onClick={(e) => e.stopPropagation()}>
            {/* 오른쪽 액션 버튼 영역: 신고 버튼과 하트 버튼 모두 유지 */}
            <button className='icon-btn'>신고</button>
            <button className='icon-btn'>❤️</button>
        </div>
    </div>
  )
}

export default CommunityCard