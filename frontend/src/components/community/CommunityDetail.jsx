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

  // ✅ 1. 유저 정보 로드 (토큰 이름 'token' 또는 'accessToken' 확인 필수)
  useEffect(() => {
    const token = localStorage.getItem('token') || localStorage.getItem('accessToken');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]))
        // Spring Security 기본 구조인 sub 또는 userId 확인
        const uid = payload.userId || payload.sub || payload.id;
        if (uid) setCurrentUserId(Number(uid));
      } catch (e) { 
        console.error("토큰 읽기 실패:", e);
      }
    }
  }, [])

  // ✅ 2. 댓글 목록 가져오기
  const fetchComments = async () => {
    try {
      const res = await communityApi.getComments(postId)
      const rawData = Array.isArray(res) ? res : []
      
      // 부모-자식 정렬 로직 (스네이크 케이스 대응)
      const sortedData = [...rawData].sort((a, b) => {
        const aP = a.parent_comment_id || a.parentCommentId;
        const bP = b.parent_comment_id || b.parentCommentId;
        const aId = a.comment_id || a.commentId;
        const bId = b.comment_id || b.commentId;
        const aG = aP || aId; const bG = bP || bId;
        if (aG === bG) {
          if (!aP) return -1;
          if (!bP) return 1;
          return new Date(a.createdDate) - new Date(b.createdDate);
        }
        return aG - bG;
      });
      setComments(sortedData)
    } catch (err) { 
      console.error("댓글 로드 실패:", err);
      setComments([]);
    }
  }

  const fetchData = async () => {
    try {
      const postData = await communityApi.getPostDetail(postId);
      setPost(postData);
      await fetchComments();
    } catch (err) { 
      console.error("데이터 로드 실패:", err);
    } finally { 
      setLoading(false);
    }
  }

  useEffect(() => { 
    if(postId) fetchData();
  }, [postId])

  // ✅ 3. 좋아요 로직
  const handleLike = async (id) => {
    if (!currentUserId) { alert("로그인이 필요합니다."); return; }
    try {
      await communityApi.likeComment(id, currentUserId);
      setLikedComments(prev => {
        const next = new Set(prev);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        return next;
      });
      await fetchComments(); 
    } catch (e) { console.error("좋아요 에러:", e); }
  }

  // ✅ 4. 댓글 등록 (DTO 필드명 post_id, user_id 필항!)
  const handleCommentSubmit = async () => {
    if (!currentUserId) { alert("로그인 세션이 만료되었습니다."); return; }
    if (!commentInput.trim()) return;
    
    try {
      await communityApi.createComment({ 
        post_id: Number(postId), 
        user_id: currentUserId, 
        content: commentInput 
      });
      setCommentInput(""); 
      await fetchComments();
    } catch (err) { 
      alert("댓글 등록에 실패했습니다.");
    }
  }

  // ✅ 5. 답글 등록 (parent_comment_id 필수)
  const handleReplySubmit = async (parentId) => {
    if (!currentUserId || !replyContent.trim()) return;
    try {
      await communityApi.createComment({ 
        post_id: Number(postId), 
        user_id: currentUserId, 
        content: replyContent, 
        parent_comment_id: Number(parentId) 
      });
      setReplyContent(""); 
      setReplyingToId(null); 
      await fetchComments();
    } catch (err) { 
      alert("답글 등록 실패");
    }
  }

  // ✅ 6. 수정 처리 (컨트롤러에서 Map으로 받으므로 필드명 일치 필수)
  const handleEditSubmit = async (id) => {
    if (!editContent.trim()) return;
    try {
      await communityApi.updateComment(id, { 
        content: editContent, 
        user_id: currentUserId 
      });
      setEditingCommentId(null); 
      await fetchComments();
    } catch (e) {
      alert("수정 권한이 없거나 오류가 발생했습니다.");
    }
  }

  // ✅ 7. 삭제 처리
  const handleDelete = async (id) => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      try { 
        await communityApi.deleteComment(id, currentUserId); 
        await fetchComments(); 
      } catch (e) {
        alert("삭제 실패");
      }
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
          <span>👤 {post?.name || post?.author || "익명"}</span>
          <span>📅 {post?.createdDate?.split('T')[0]}</span>
        </div>
      </div>

      <div className='detail-card'><div className='detail-content'>{post?.content}</div></div>

      <div className="comment-section">
        <h3 className="comment-title">댓글 {comments.length}</h3>
        <div className="comment-write-container">
          <textarea 
            className="comment-input-field" 
            value={commentInput} 
            onChange={(e) => setCommentInput(e.target.value)} 
            placeholder={currentUserId ? "댓글을 남겨보세요" : "로그인 후 이용 가능합니다"}
            disabled={!currentUserId}
          />
          <button className="comment-submit-button" onClick={handleCommentSubmit} disabled={!currentUserId}>등록</button>
        </div>

        <div className="comment-list-container">
          {comments.map((c) => {
            const cId = c.comment_id || c.commentId;
            const cUserId = c.user_id || c.userId;
            const isOwner = Number(cUserId) === Number(currentUserId);
            const isEditing = editingCommentId === cId;
            const isReply = !!(c.parent_comment_id || c.parentCommentId);
            const likeCount = c.commentLikeCount ?? 0;
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
                        <>
                          <button className="btn-edit" onClick={() => {setEditingCommentId(cId); setEditContent(c.content);}}>수정</button>
                          <button className="btn-delete" onClick={() => handleDelete(cId)}>삭제</button>
                        </>
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
                        style={{ cursor: 'pointer', fontWeight: '800', display: 'inline-flex', alignItems: 'center', gap: '4px', color: hasLikes ? '#ff4d4f' : '#666' }}
                      >
                        {hasLikes ? '❤️' : '🤍'} {likeCount}
                      </span>
                    </div>

                    {replyingToId === cId && (
                      <div className="comment-edit-box reply-input-container">
                        <textarea value={replyContent} onChange={(e) => setReplyContent(e.target.value)} autoFocus />
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