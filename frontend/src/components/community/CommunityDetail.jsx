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
  const [editingCommentId, setEditingCommentId] = useState(null)
  const [editContent, setEditContent] = useState("")
  const [currentUserId, setCurrentUserId] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]))
        const userId = payload.sub || payload.userId || payload.id
        if (userId) setCurrentUserId(Number(userId));
      } catch (error) { console.error('토큰 파싱 실패:', error) }
    }
  }, [])

  const fetchComments = async () => {
    try {
      const res = await communityApi.getComments(postId)
      setComments(Array.isArray(res) ? res : [])
    } catch (err) { setComments([]) }
  }

  const fetchData = async () => {
    try {
      const postData = await communityApi.getPostDetail(postId)
      setPost(postData)
      await fetchComments() 
    } catch (err) { console.error(err) } finally { setLoading(false) }
  }

  useEffect(() => { fetchData() }, [postId])

  const handleCommentSubmit = async () => {
    if (!currentUserId) { alert("로그인이 필요합니다."); navigate('/login'); return; }
    if (!commentInput.trim()) return;
    try {
      await communityApi.createComment({ post_id: Number(postId), user_id: currentUserId, content: commentInput });
      setCommentInput(""); await fetchComments();
    } catch (err) { alert("등록 실패"); }
  }

  const handleEditSubmit = async (commentId) => {
    try {
      await communityApi.updateComment(commentId, { content: editContent, user_id: currentUserId });
      setEditingCommentId(null); await fetchComments();
    } catch (err) { alert("수정 실패"); }
  }

  const handleDelete = async (commentId, commentUserId) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    try {
      await communityApi.deleteComment(commentId, currentUserId);
      await fetchComments();
    } catch (err) { alert("삭제 실패"); }
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

      <div className="comment-section">
        <h3 className="comment-title">댓글 {comments.length}</h3>
        
        <div className="comment-write-container">
          <textarea 
            className="comment-input-field"
            value={commentInput}
            onChange={(e) => setCommentInput(e.target.value)}
            placeholder="댓글을 남겨보세요"
          />
          <button className="comment-submit-button" onClick={handleCommentSubmit}>등록</button>
        </div>

        <div className="comment-list-container">
          {comments.map((c, index) => {
            const isOwner = c.userId === currentUserId;
            const isEditing = editingCommentId === c.commentId;

            return (
              <div key={c.commentId || index} className="comment-card-item">
                <div className="comment-item-header">
                  <span className="comment-author-name">{c.name || '익명'}</span>
                  <div className="comment-header-right">
                    <span className="comment-date-text">방금 전</span>
                    {isOwner && !isEditing && (
                      <div className="comment-owner-btns">
                        <button className="btn-edit" onClick={() => {setEditingCommentId(c.commentId); setEditContent(c.content);}}>수정</button>
                        <button className="btn-delete" onClick={() => handleDelete(c.commentId, c.userId)}>삭제</button>
                      </div>
                    )}
                  </div>
                </div>

                {isEditing ? (
                  <div className="comment-edit-box">
                    <textarea value={editContent} onChange={(e) => setEditContent(e.target.value)} />
                    <div className="edit-btn-group">
                      <button onClick={() => handleEditSubmit(c.commentId)}>저장</button>
                      <button onClick={() => setEditingCommentId(null)}>취소</button>
                    </div>
                  </div>
                ) : (
                  <p className="comment-body-text">{c.content}</p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  )
}
export default CommunityDetail;