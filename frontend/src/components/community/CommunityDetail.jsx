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
  // 🔥 내가 누른 좋아요 상태만 따로 관리
  const [myLikedComments, setMyLikedComments] = useState(new Set())

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
      setMyLikedComments(prev => {
        const next = new Set(prev);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        return next;
      });
      await fetchComments(); 
    } catch (e) { console.error(e); }
  }

  // ... (다른 등록/수정/삭제 핸들러는 그대로 유지)

  if (loading) return <div className='detail-wrap'>로딩 중...</div>

  return (
    <div className='detail-wrap'>
      {/* ... 상단 포스트 영역 생략 (원본 유지) ... */}
      
      <div className="comment-section">
        {/* ... 댓글 작성 영역 생략 (원본 유지) ... */}

        <div className="comment-list-container">
          {comments.map((c) => {
            const isOwner = c.userId === currentUserId || c.user_id === currentUserId;
            const cId = c.commentId || c.comment_id;
            const isEditing = editingCommentId === cId;
            const isReply = !!(c.parentCommentId || c.parent_comment_id);
            
            // 🔥 형님! 여기서 좋아요 하트랑 색깔 로직 수정했습니다!
            const likeCount = c.commentLikeCount ?? 0;
            // 내가 방금 눌렀거나, 서버에서 이미 내가 눌렀다고 판단되는 경우 (isLiked 필드가 백엔드에 있다면 추가)
            const activeLike = myLikedComments.has(cId); 

            return (
              <div key={cId} className={`comment-card-item ${isReply ? 'comment-reply-item' : ''}`}>
                <div className="comment-item-header">
                  <span className="comment-author-name">{c.name || '익명'}</span>
                  {/* ... 헤더 생략 (원본 유지) ... */}
                </div>

                {isEditing ? (
                  // ... 수정 영역 생략 (원본 유지) ...
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
                          // 🔥 좋아요 0개면 회색, 내가 눌렀을 때만 빨간색
                          color: activeLike || likeCount > 0 ? '#ff4d4f' : '#adb5bd' 
                        }}
                      >
                        {/* 🔥 0개면 빈 하트, 있으면 채워진 하트 */}
                        {activeLike || likeCount > 0 ? '❤️' : '🤍'} {likeCount}
                      </span>
                    </div>
                    {/* ... 답글 입력창 영역 생략 (원본 유지) ... */}
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