import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { communityApi } from '../../api/communityApi'
import "../../assets/css/community/CommunityDetail.css"

function CommunityDetail() {
  const { postId } = useParams()
  const navigate = useNavigate()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [comments, setComments] = useState([]) 
  const [commentInput, setCommentInput] = useState("")

  const fetchComments = async () => {
    try {
      const res = await communityApi.getComments(postId)
      setComments(Array.isArray(res) ? res : [])
    } catch (err) {
      console.error("댓글 로딩 실패:", err)
      setComments([])
    }
  }

  const fetchData = async () => {
    try {
      const postData = await communityApi.getPostDetail(postId)
      setPost(postData)
      await fetchComments() 
    } catch (err) {
      console.error("데이터 로딩 실패:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [postId])

  const handleCommentSubmit = async () => {
    if (!commentInput.trim()) return;
    try {
      // ✅ 백엔드 DTO(CommentCreate)의 필드명과 정확히 일치시킴
      await communityApi.createComment({
        post_id: Number(postId),
        user_id: 1, 
        content: commentInput
      });
      
      setCommentInput(""); 
      await fetchComments(); 
    } catch (err) {
      console.error("등록 에러:", err);
      alert("등록 실패: 백엔드 필드 매핑을 확인하세요.");
    }
  }

  if (loading) return <div className='detail-wrap'>로딩 중...</div>

  return (
    <div className='detail-wrap'>
      <div className='detail-hero'>
        <button className='back-btn' onClick={() => navigate(-1)}>←</button>
        <div className='detail-title-row'>
          <span className='detail-chip'>{post?.category}</span>
          <h1 className='detail-title'>{post?.title}</h1>
        </div>
        <div className="detail-meta">
          <span>👤 {post?.name || "익명"}</span>
          <span>📅 {post?.created_date}</span>
        </div>
      </div>
      
      <div className='detail-card'>
        <div className='detail-content'>{post?.content}</div>
      </div>

      <div className="comment-section" style={{ marginTop: "30px", borderTop: "1px solid #333", paddingTop: "20px" }}>
        <h3 style={{ color: "#fff" }}>댓글 {comments.length}</h3>
        
        <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
          <textarea 
            value={commentInput}
            onChange={(e) => setCommentInput(e.target.value)}
            style={{ flex: 1, backgroundColor: "#222", color: "#fff", padding: "10px", borderRadius: "5px", border: "1px solid #444" }}
            placeholder="댓글을 남겨보세요"
          />
          <button 
            onClick={handleCommentSubmit}
            style={{ padding: "0 20px", backgroundColor: "#3b82f6", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer", fontWeight: "bold" }}
          >등록</button>
        </div>

        <div className="comment-list">
          {comments.map((c, index) => (
            // 🔥 key 에러 방지용 고유 키 생성
            <div key={c.commentId || `comment-${index}`} style={{ padding: "15px 0", borderBottom: "1px solid #222" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
                <span style={{ color: "#60a5fa", fontWeight: "bold" }}>{c.name || '익명'}</span>
                <span style={{ color: "#666", fontSize: "12px" }}>
                  {Array.isArray(c.createdDate) 
                    ? `${c.createdDate[0]}-${String(c.createdDate[1]).padStart(2, '0')}-${String(c.createdDate[2]).padStart(2, '0')}`
                    : "방금 전"}
                </span>
              </div>
              <p style={{ color: "#ccc", margin: 0, whiteSpace: "pre-wrap" }}>{c.content}</p>
            </div>
          ))}
          {comments.length === 0 && <p style={{ color: "#666", textAlign: "center" }}>등록된 댓글이 없습니다.</p>}
        </div>
      </div>
    </div>
  )
}

export default CommunityDetail;