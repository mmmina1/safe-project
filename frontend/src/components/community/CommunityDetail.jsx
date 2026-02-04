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
  const [replyingToId, setReplyingToId] = useState(null)
  const [replyContent, setReplyContent] = useState("")

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
      const rawData = Array.isArray(res) ? res : []
      const sortedData = [...rawData].sort((a, b) => {
        const aParentId = a.parentCommentId || a.parent_comment_id;
        const bParentId = b.parentCommentId || b.parent_comment_id;
        const aId = a.commentId || a.comment_id;
        const bId = b.commentId || b.comment_id;
        const aGroup = aParentId || aId;
        const bGroup = bParentId || bId;
        if (aGroup === bGroup) {
          if (!aParentId) return -1;
          if (!bParentId) return 1;
          return new Date(a.createdDate) - new Date(b.createdDate);
        }
        return aGroup - bGroup;
      });
      setComments(sortedData)
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

  // 🔥 핵심 수정: handleLike 호출 시 currentUserId 전달
  const handleLike = async (commentId) => {
    if (!currentUserId) {
      alert("로그인이 필요합니다.");
      return;
    }
    try {
      // 🔥 인자로 currentUserId를 반드시 넘겨야 백엔드가 500을 안 뱉습니다.
      await communityApi.likeComment(commentId, currentUserId);
      await fetchComments(); 
    } catch (err) {
      console.error("좋아요 실패:", err);
    }
  }

  const handleCommentSubmit = async () => {
    if (!currentUserId) { alert("로그인이 필요합니다."); navigate('/login'); return; }
    if (!commentInput.trim()) return;
    try {
      await communityApi.createComment({ post_id: Number(postId), user_id: currentUserId, content: commentInput });
      setCommentInput(""); await fetchComments();
    } catch (err) { alert("등록 실패"); }
  }

  const handleReplySubmit = async (parentId) => {
    if (!currentUserId) { alert("로그인이 필요합니다."); navigate('/login'); return; }
    if (!replyContent.trim()) return;
    try {
      await communityApi.createComment({ 
        post_id: Number(postId), 
        user_id: currentUserId, 
        content: replyContent,
        parent_comment_id: parentId 
      });
      setReplyContent(""); setReplyingToId(null); await fetchComments();
    } catch (err) { alert("답글 등록 실패"); }
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
          <span>📅 {post?.createdDate ? post.createdDate.split('T')[0] : ""}</span>
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
            const isOwner = c.userId === currentUserId || c.user_id === currentUserId;
            const targetCommentId = c.commentId || c.comment_id;
            const isEditing = editingCommentId === targetCommentId;
            const isReply = (c.parentCommentId || c.parent_comment_id) != null;

            return (
              <div key={targetCommentId || index} className={`comment-card-item ${isReply ? 'comment-reply-item' : ''}`}>
                <div className="comment-item-header">
                  <span className="comment-author-name">{c.name || '익명'}</span>
                  <div className="comment-header-right">
                    <span className="comment-date-text">
                      {c.createdDate ? c.createdDate.split('T')[0] : "방금 전"}
                    </span>
                    <div className="comment-owner-btns">
                      {!isEditing && (
                        <button className="btn-reply" onClick={() => {setReplyingToId(targetCommentId); setReplyContent("");}}>답글</button>
                      )}
                      {isOwner && !isEditing && (
                        <>
                          <button className="btn-edit" onClick={() => {setEditingCommentId(targetCommentId); setEditContent(c.content);}}>수정</button>
                          <button className="btn-delete" onClick={() => handleDelete(targetCommentId, c.userId)}>삭제</button>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {isEditing ? (
                  <div className="comment-edit-box">
                    <textarea value={editContent} onChange={(e) => setEditContent(e.target.value)} />
                    <div className="edit-btn-group">
                      <button className="btn-save-confirm" onClick={() => handleEditSubmit(targetCommentId)}>저장</button>
                      <button className="btn-cancel-edit" onClick={() => setEditingCommentId(null)}>취소</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="comment-body-text">{c.content}</p>
                    <div className="comment-footer" style={{ marginTop: '8px', fontSize: '13px' }}>
                      <span 
                        className="like-btn" 
                        onClick={() => handleLike(targetCommentId)}
                        style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#000', fontWeight: '700', userSelect: 'none' }}
                      >
                        ❤️ {c.commentLikeCount ?? 0}
                      </span>
                    </div>

                    {replyingToId === targetCommentId && (
                      <div className="comment-edit-box reply-input-container">
                        <textarea value={replyContent} onChange={(e) => setReplyContent(e.target.value)} placeholder="답글을 입력하세요..." />
                        <div className="edit-btn-group">
                          <button className="btn-save-confirm" onClick={() => handleReplySubmit(targetCommentId)}>등록</button>
                          <button className="btn-cancel-edit" onClick={() => setReplyingToId(null)}>취소</button>
                        </div>
                      </div>
                    )}
                  </>
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