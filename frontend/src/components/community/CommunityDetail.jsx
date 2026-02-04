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
  const [likedComments, setLikedComments] = useState(new Set())

  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]))
        const uid = payload.sub || payload.userId || payload.id
        if (uid) setCurrentUserId(Number(uid));
      } catch (e) { console.error(e) }
    }
  }, [])

  const fetchComments = async () => {
    try {
      const res = await communityApi.getComments(postId)
      const rawData = Array.isArray(res) ? res : []
      // 🔥 정렬 로직 (부모-자식 관계 유지)
      const sortedData = [...rawData].sort((a, b) => {
        const aP = a.parentCommentId || a.parent_comment_id;
        const bP = b.parentCommentId || b.parent_comment_id;
        const aId = a.commentId || a.comment_id;
        const bId = b.commentId || b.comment_id;
        const aG = aP || aId; const bG = bP || bId;
        if (aG === bG) {
          if (!aP) return -1;
          if (!bP) return 1;
          return new Date(a.createdDate) - new Date(b.createdDate);
        }
        return aG - bG;
      });
      setComments(sortedData)
    } catch (err) { setComments([]) }
  }

  const fetchData = async () => {
    try {
      setPost(await communityApi.getPostDetail(postId));
      await fetchComments();
    } catch (err) { console.error(err) } finally { setLoading(false) }
  }

  useEffect(() => { fetchData() }, [postId])

  const handleLike = async (id) => {
    if (!currentUserId) return;
    try {
      await communityApi.likeComment(id, currentUserId);
      setLikedComments(prev => {
        const next = new Set(prev);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        return next;
      });
      await fetchComments(); 
    } catch (e) { console.error(e); }
  }

  const handleCommentSubmit = async () => {
    if (!currentUserId || !commentInput.trim()) return;
    try {
      await communityApi.createComment({ postId: Number(postId), userId: currentUserId, content: commentInput });
      setCommentInput(""); await fetchComments();
    } catch (err) { alert("등록 실패"); }
  }

  const handleReplySubmit = async (parentId) => {
    if (!currentUserId || !replyContent.trim()) return;
    try {
      await communityApi.createComment({ postId: Number(postId), userId: currentUserId, content: replyContent, parentCommentId: Number(parentId) });
      setReplyContent(""); setReplyingToId(null); await fetchComments();
    } catch (err) { alert("답글 등록 실패"); }
  }

  const handleEditSubmit = async (id) => {
    try {
      await communityApi.updateComment(id, { content: editContent, userId: currentUserId });
      setEditingCommentId(null); await fetchComments();
    } catch (e) {}
  }

  const handleDelete = async (id) => {
    if (window.confirm("삭제하시겠습니까?")) {
      try { await communityApi.deleteComment(id, currentUserId); await fetchComments(); } catch (e) {}
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
          <span>📅 {post?.createdDate?.split('T')[0]}</span>
        </div>
      </div>

      <div className='detail-card'><div className='detail-content'>{post?.content}</div></div>

      <div className="comment-section">
        <h3 className="comment-title">댓글 {comments.length}</h3>
        <div className="comment-write-container">
          <textarea className="comment-input-field" value={commentInput} onChange={(e) => setCommentInput(e.target.value)} placeholder="댓글을 남겨보세요" />
          <button className="comment-submit-button" onClick={handleCommentSubmit}>등록</button>
        </div>

        <div className="comment-list-container">
          {comments.map((c) => {
            const isOwner = c.userId === currentUserId || c.user_id === currentUserId;
            const cId = c.commentId || c.comment_id;
            const isEditing = editingCommentId === cId;
            const isReply = !!(c.parentCommentId || c.parent_comment_id);
            
            // 🔥 형님! 여기 로직 집중해주세요.
            // 1. 좋아요 수: 백엔드에서 온 데이터(c.commentLikeCount)를 최우선으로 씁니다.
            const likeCount = c.commentLikeCount ?? 0;
            // 2. 빨간 하트 조건: 좋아요 수가 0보다 크거나, 내가 방금 눌렀거나!
            const hasLikes = likeCount > 0 || likedComments.has(cId);

            return (
              <div key={cId} className={`comment-card-item ${isReply ? 'comment-reply-item' : ''}`}>
                <div className="comment-item-header">
                  <span className="comment-author-name">{c.name || '익명'}</span>
                  <div className="comment-header-right">
                    <span className="comment-date-text">{c.createdDate?.split('T')[0]}</span>
                    <div className="comment-owner-btns">
                      {!isEditing && <button className="btn-reply" onClick={() => {setReplyingToId(cId); setReplyContent("");}}>답글</button>}
                      {isOwner && !isEditing && (
                        <><button className="btn-edit" onClick={() => {setEditingCommentId(cId); setEditContent(c.content);}}>수정</button>
                        <button className="btn-delete" onClick={() => handleDelete(cId)}>삭제</button></>
                      )}
                    </div>
                  </div>
                </div>

                {isEditing ? (
                  <div className="comment-edit-box">
                    <textarea value={editContent} onChange={(e) => setEditContent(e.target.value)} />
                    <button className="btn-save-confirm" onClick={() => handleEditSubmit(cId)}>저장</button>
                    <button className="btn-cancel-edit" onClick={() => setEditingCommentId(null)}>취소</button>
                  </div>
                ) : (
                  <>
                    <p className="comment-body-text">{c.content}</p>
                    <div className="comment-footer" style={{ marginTop: '8px' }}>
                      <span 
                        className="like-btn" 
                        onClick={() => handleLike(cId)} 
                        style={{ 
                          cursor: 'pointer', 
                          fontWeight: '800', 
                          display: 'inline-flex', 
                          alignItems: 'center', 
                          gap: '4px',
                          color: hasLikes ? '#ff4d4f' : '#666' // 👈 mina처럼 빨간색 적용
                        }}
                      >
                        {hasLikes ? '❤️' : '🤍'} {likeCount}
                      </span>
                    </div>

                    {replyingToId === cId && (
                      <div className="comment-edit-box reply-input-container">
                        <textarea value={replyContent} onChange={(e) => setReplyContent(e.target.value)} />
                        <div className="edit-btn-group">
                          <button className="btn-save-confirm" onClick={() => handleReplySubmit(cId)}>등록</button>
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