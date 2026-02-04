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

  // 대댓글용 상태
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

  // ★ 정렬 로직이 추가된 fetchComments
  const fetchComments = async () => {
    try {
      const res = await communityApi.getComments(postId)
      const rawData = Array.isArray(res) ? res : []

      // 부모-자식 관계에 따라 정렬 (부모 바로 아래에 자식이 오도록)
      const sortedData = [...rawData].sort((a, b) => {
        const aGroup = a.parent_comment_id || a.comment_id;
        const bGroup = b.parent_comment_id || b.comment_id;

        if (aGroup === bGroup) {
          // 같은 그룹 내에서 부모(parent_comment_id가 null)를 위로
          if (a.parent_comment_id === null) return -1;
          if (b.parent_comment_id === null) return 1;
          // 대댓글끼리는 시간순
          return new Date(a.created_date) - new Date(b.created_date);
        }
        // 다른 그룹끼리는 그룹 ID(부모 ID) 순서대로
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

  const handleCommentSubmit = async () => {
    if (!currentUserId) { alert("로그인이 필요합니다."); navigate('/login'); return; }
    if (!commentInput.trim()) return;
    try {
      await communityApi.createComment({ post_id: Number(postId), user_id: currentUserId, content: commentInput });
      alert("댓글이 등록되었습니다!");
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
      setReplyContent("");
      setReplyingToId(null);
      await fetchComments();
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
          {/* 변경 포인트: created_date -> createdDate (백엔드 필드명 일치) */}
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
            const isOwner = c.userId === currentUserId;
            const isEditing = editingCommentId === c.commentId;
            const isReplying = replyingToId === c.commentId;
            const isReply = c.parent_comment_id !== null && c.parent_comment_id !== undefined;

            return (
              <div key={c.commentId || index} className={`comment-card-item ${isReply ? 'comment-reply-item' : ''}`}>
                <div className="comment-item-header">
                  <span className="comment-author-name">{c.name || '익명'}</span>
                  <div className="comment-header-right">
                    <span className="comment-date-text">방금 전</span>
                    <div className="comment-owner-btns">
                      {!isEditing && (
                        <button className="btn-reply" onClick={() => {setReplyingToId(c.commentId); setReplyContent("");}}>답글</button>
                      )}
                      {isOwner && !isEditing && (
                        <>
                          <button className="btn-edit" onClick={() => {setEditingCommentId(c.commentId); setEditContent(c.content);}}>수정</button>
                          <button className="btn-delete" onClick={() => handleDelete(c.commentId, c.userId)}>삭제</button>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {isEditing ? (
                  <div className="comment-edit-box">
                    <textarea value={editContent} onChange={(e) => setEditContent(e.target.value)} />
                    <div className="edit-btn-group">
                      <button className="btn-save-confirm" onClick={() => handleEditSubmit(c.commentId)}>저장</button>
                      <button className="btn-cancel-edit" onClick={() => setEditingCommentId(null)}>취소</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="comment-body-text">{c.content}</p>
                    {isReplying && (
                      <div className="comment-edit-box reply-input-container">
                        <textarea 
                          value={replyContent} 
                          onChange={(e) => setReplyContent(e.target.value)} 
                          placeholder="답글을 입력하세요..."
                        />
                        <div className="edit-btn-group">
                          <button className="btn-save-confirm" onClick={() => handleReplySubmit(c.commentId)}>등록</button>
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