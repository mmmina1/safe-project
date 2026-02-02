import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { communityApi } from '../../api/communityApi'
import "../../assets/css/community/CommunityDetail.css"


function CommunityDetail() {

  const {postId} = useParams()
  const navigate = useNavigate()

  const [post,setPost] = useState(null)
  const [loading,setLoading] = useState(true)

  useEffect(() => {
    if (!postId || postId === "undefined") {
      setLoading(false)
      return
    }

    const run = async () => {
      setLoading(true)
      try {
        const data = await communityApi.getPostDetail(postId)
        setPost(data)
      } catch (e) {
        console.error("상세 조회 실패:", e)
        setPost(null)
      } finally {
        setLoading(false)
      }
    }
    run()
  },[postId])

  if(loading) return <div className='detail-wrap'>불러오는 중...</div>
  if(!post) return <div className='detail-wrap'>게시글을 찾을 수 없습니다.</div>

  return (
    <div className='detail-wrap'>
      <div className='detail-hero'>
        <button className='back-btn' onClick={() => navigate(-1)}>←</button>

        <div className='detail-title-row'>
          <span className='detail-chip'>{post.category}</span>
          <h1 className='detail-title'>{post.title}</h1>
        </div>

        <div className="detail-meta">
          <span>👤 {post.name ?? (post.user_id ? `${post.name}` : "익명")}</span>
          <span>📅 {post.created_date ? new Date(post.created_date).toLocaleDateString() : "-"}</span>
          <span>👁 {post.visit_count ?? 0}</span>
          <span>❤️ {post.like_count ?? 0}</span>
          <span>🚨 신고 {post.report_count ?? 0}</span>
        </div>

        <div className='detail-actions'>
          <button className='action-btn danger'>신고</button>
          <button className='action-btn ghost'>☆</button>
        </div>
      </div>

      <div className='detail-card'>
        {post.attachments?.length > 0 && (
          <div className='detail-attachments'>
            {post.attachments.map((url,idx) => (
              <img key={idx} className='detail-img' src={url} alt='첨부'/>
            ))}
          </div>
        )}

        <div className='detail-content'>
          {post.content}
        </div>
      </div>
      
      {/* 하단 액션바 */}
      <div className="detail-bottom">
        <button className="btn-ghost" onClick={() => navigate("/community")}>목록</button>
        <button className="btn-like">❤️ 추천</button>
        <button className="btn-ghost" onClick={() => navigator.clipboard.writeText(window.location.href)}>
          🔗 공유
        </button>
      </div>

      {/* 댓글(원하면 추가) */}
      {/* <CommentSection postId={postId} /> */}

      {/* 유사사례(원하면 추가) */}
      {/* <SimilarCaseCarousel postId={postId} /> */}
    </div>
  );
}

export default CommunityDetail