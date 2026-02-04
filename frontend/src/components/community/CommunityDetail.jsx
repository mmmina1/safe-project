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
  const [currentUserName, setCurrentUserName] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    const userName = localStorage.getItem('userName')
    
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]))
        const userId = payload.sub || payload.userId || payload.id
        
        if (userId) {
          setCurrentUserId(Number(userId))
          setCurrentUserName(userName)
        }
      } catch (error) {
        console.error('토큰 파싱 실패:', error)
      }
    }
  }, [])

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
    if (!currentUserId) {
      alert("로그인이 필요합니다.");
      navigate('/login');
      return;
    }

    if (!commentInput.trim()) {
      alert("댓글 내용을 입력해주세요.");
      return;
    }
    
    try {
      await communityApi.createComment({
        post_id: Number(postId),
        user_id: currentUserId,
        content: commentInput
      });
      
      setCommentInput(""); 
      await fetchComments(); 
      alert("댓글이 등록되었습니다!");
    } catch (err) {
      console.error("등록 에러:", err);
      alert("댓글 등록 실패");
    }
  }

  const handleEditClick = (comment) => {
    if (comment.userId !== currentUserId) {
      alert("본인의 댓글만 수정할 수 있습니다.");
      return;
    }
    setEditingCommentId(comment.commentId)
    setEditContent(comment.content)
  }

  const handleEditSubmit = async (commentId) => {
    if (!editContent.trim()) {
      alert("댓글 내용을 입력해주세요.");
      return;
    }
    
    try {
      await communityApi.updateComment(commentId, {
        content: editContent,
        user_id: currentUserId
      });
      
      setEditingCommentId(null);
      setEditContent("");
      await fetchComments();
      alert("댓글이 수정되었습니다!");
    } catch (err) {
      console.error("수정 에러:", err);
      alert(err.response?.data?.error || "댓글 수정에 실패했습니다.");
    }
  }

  const handleEditCancel = () => {
    setEditingCommentId(null)
    setEditContent("")
  }

  const handleDelete = async (commentId, commentUserId) => {
    if (commentUserId !== currentUserId) {
      alert("본인의 댓글만 삭제할 수 있습니다.");
      return;
    }

    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    
    try {
      await communityApi.deleteComment(commentId, currentUserId);
      await fetchComments();
      alert("댓글이 삭제되었습니다!");
    } catch (err) {
      console.error("삭제 에러:", err);
      alert(err.response?.data?.error || "댓글 삭제에 실패했습니다.");
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
        
        {currentUserId ? (
          <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
            <textarea 
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
              style={{ flex: 1, backgroundColor: "#222", color: "#fff", padding: "10px", borderRadius: "5px", border: "1px solid #444" }}
              placeholder="댓글을 남겨보세요"
              rows="3"
            />
            <button 
              onClick={handleCommentSubmit}
              style={{ padding: "0 20px", backgroundColor: "#3b82f6", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer", fontWeight: "bold" }}
            >등록</button>
          </div>
        ) : (
          <div style={{ padding: "20px", backgroundColor: "#222", borderRadius: "5px", textAlign: "center", marginBottom: "20px" }}>
            <p style={{ color: "#999", margin: 0 }}>
              댓글을 작성하려면 
              <button 
                onClick={() => navigate('/login')} 
                style={{ color: "#3b82f6", background: "none", border: "none", cursor: "pointer", textDecoration: "underline", marginLeft: "5px" }}
              >
                로그인
              </button>
              이 필요합니다.
            </p>
          </div>
        )}

        <div className="comment-list">
          {comments.map((c, index) => {
            const isOwner = c.userId === currentUserId;
            const isEditing = editingCommentId === c.commentId;

            return (
              <div key={c.commentId || `comment-${index}`} style={{ padding: "15px 0", borderBottom: "1px solid #222" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
                  <span style={{ color: "#60a5fa", fontWeight: "bold" }}>{c.name || '익명'}</span>
                  <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                    <span style={{ color: "#666", fontSize: "12px" }}>
                      {Array.isArray(c.createdDate) 
                        ? `${c.createdDate[0]}-${String(c.createdDate[1]).padStart(2, '0')}-${String(c.createdDate[2]).padStart(2, '0')}`
                        : "방금 전"}
                    </span>
                    
                    {isOwner && !isEditing && (
                      <>
                        <button 
                          onClick={() => handleEditClick(c)}
                          style={{ padding: "4px 10px", fontSize: "12px", backgroundColor: "#10b981", color: "#fff", border: "none", borderRadius: "3px", cursor: "pointer" }}
                        >수정</button>
                        <button 
                          onClick={() => handleDelete(c.commentId, c.userId)}
                          style={{ padding: "4px 10px", fontSize: "12px", backgroundColor: "#ef4444", color: "#fff", border: "none", borderRadius: "3px", cursor: "pointer" }}
                        >삭제</button>
                      </>
                    )}
                  </div>
                </div>

                {isEditing ? (
                  <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                    <textarea 
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      style={{ flex: 1, backgroundColor: "#222", color: "#fff", padding: "10px", borderRadius: "5px", border: "1px solid #444" }}
                      rows="3"
                    />
                    <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                      <button 
                        onClick={() => handleEditSubmit(c.commentId)}
                        style={{ padding: "8px 15px", fontSize: "12px", backgroundColor: "#3b82f6", color: "#fff", border: "none", borderRadius: "3px", cursor: "pointer" }}
                      >저장</button>
                      <button 
                        onClick={handleEditCancel}
                        style={{ padding: "8px 15px", fontSize: "12px", backgroundColor: "#6b7280", color: "#fff", border: "none", borderRadius: "3px", cursor: "pointer" }}
                      >취소</button>
                    </div>
                  </div>
                ) : (
                  <p style={{ color: "#ccc", margin: 0, whiteSpace: "pre-wrap" }}>{c.content}</p>
                )}
              </div>
            );
          })}
          {comments.length === 0 && <p style={{ color: "#666", textAlign: "center" }}>등록된 댓글이 없습니다.</p>}
        </div>
      </div>
    </div>
  )
}

export default CommunityDetail;