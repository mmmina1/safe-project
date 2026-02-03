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
  
  // 🔥 수정 모드 관리
  const [editingCommentId, setEditingCommentId] = useState(null)
  const [editContent, setEditContent] = useState("")
  
  // 🔥 현재 로그인 사용자 ID (임시로 1번, 나중에 실제 로그인 연동)
  const currentUserId = 1

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
      await communityApi.createComment({
        post_id: Number(postId),
        user_id: currentUserId, // 🔥 현재 로그인 사용자
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

  // 🔥 댓글 수정
  const handleEditClick = (comment) => {
    setEditingCommentId(comment.commentId)
    setEditContent(comment.content)
  }

  const handleEditSubmit = async (commentId) => {
    if (!editContent.trim()) return;
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
      alert(err.response?.data?.error || "본인의 댓글만 수정할 수 있습니다");
    }
  }

  const handleEditCancel = () => {
    setEditingCommentId(null)
    setEditContent("")
  }

  // 🔥 댓글 삭제
  const handleDelete = async (commentId) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    
    try {
      await communityApi.deleteComment(commentId, currentUserId);
      await fetchComments();
      alert("댓글이 삭제되었습니다!");
    } catch (err) {
      console.error("삭제 에러:", err);
      alert(err.response?.data?.error || "본인의 댓글만 삭제할 수 있습니다");
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
            rows="3"
          />
          <button 
            onClick={handleCommentSubmit}
            style={{ padding: "0 20px", backgroundColor: "#3b82f6", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer", fontWeight: "bold" }}
          >등록</button>
        </div>

        <div className="comment-list">
          {comments.map((c, index) => {
            const isOwner = c.userId === currentUserId; // 🔥 본인 댓글 확인
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
                    
                    {/* 🔥 본인 댓글일 때만 수정/삭제 버튼 표시 */}
                    {isOwner && !isEditing && (
                      <>
                        <button 
                          onClick={() => handleEditClick(c)}
                          style={{ padding: "4px 10px", fontSize: "12px", backgroundColor: "#10b981", color: "#fff", border: "none", borderRadius: "3px", cursor: "pointer" }}
                        >수정</button>
                        <button 
                          onClick={() => handleDelete(c.commentId)}
                          style={{ padding: "4px 10px", fontSize: "12px", backgroundColor: "#ef4444", color: "#fff", border: "none", borderRadius: "3px", cursor: "pointer" }}
                        >삭제</button>
                      </>
                    )}
                  </div>
                </div>

                {/* 🔥 수정 모드 */}
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