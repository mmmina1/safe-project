import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { communityApi } from "../../api/communityApi";
import "../../assets/css/community/CommunityDetail.css";

function CommunityDetail() {
  const { postId } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  const [comments, setComments] = useState([]);
  const [commentInput, setCommentInput] = useState("");

  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editContent, setEditContent] = useState("");

  const [currentUserId, setCurrentUserId] = useState(null);

  const [replyingToId, setReplyingToId] = useState(null);
  const [replyContent, setReplyContent] = useState("");

  const [likedComments, setLikedComments] = useState(new Set());

  const decodeJwtPayload = (token) => {
    try {
      const base64Url = token.split(".")[1];
      if (!base64Url) return null;

      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const padded = base64 + "===".slice((base64.length + 3) % 4);

      const json = atob(padded);
      return JSON.parse(json);
    } catch {
      return null;
    }
  };

  useEffect(() => {
    const token =
      localStorage.getItem("accessToken") ||
      localStorage.getItem("token") ||
      localStorage.getItem("jwt");

    if (!token) return;

    const payload = decodeJwtPayload(token);
    if (!payload) return;

    const uid = payload.sub ?? payload.userId ?? payload.id;
    const uidNum = Number(uid);

    if (!Number.isNaN(uidNum)) setCurrentUserId(uidNum);
  }, []);

  const fetchComments = async () => {
    try {
      const res = await communityApi.getComments(postId);
      const rawData = Array.isArray(res) ? res : [];

      const sortedData = [...rawData].sort((a, b) => {
        const aP = a.parentCommentId || a.parent_comment_id;
        const bP = b.parentCommentId || b.parent_comment_id;

        const aId = a.commentId || a.comment_id;
        const bId = b.commentId || b.comment_id;

        const aG = aP || aId;
        const bG = bP || bId;

        if (aG === bG) {
          if (!aP) return -1;
          if (!bP) return 1;
          return new Date(a.createdDate) - new Date(b.createdDate);
        }
        return aG - bG;
      });

      setComments(sortedData);
    } catch (err) {
      setComments([]);
    }
  };

  const fetchData = async () => {
    try {
      setPost(await communityApi.getPostDetail(postId));
      await fetchComments();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postId]);

  useEffect(() => {
    setLikedComments(new Set());
  }, [currentUserId]);

  useEffect(() => {
    if (!postId) return;
    fetchComments();
}, [currentUserId, postId]);

  const handleLike = async (commentId) => {
    if (!currentUserId) return;

    try {
      const result = await communityApi.toggleCommentLike(commentId, currentUserId);

      setLikedComments((prev) => {
        const next = new Set(prev);
        if (result.liked) next.add(commentId);
        else next.delete(commentId);
        return next;
      });

      setComments((prev) =>
        prev.map((c) => {
          const cId = c.commentId || c.comment_id;
          if (cId !== commentId) return c;

          return {
            ...c,
            commentLikeCount: result.likeCount,
            comment_like_count: result.likeCount,
          };
        })
      );

      if (result.liked) alert("좋아요!");
      else alert("좋아요 취소!");
    } catch (e) {
      console.error(e);
      alert("좋아요 처리 실패");
    }
  };

  const handleCommentSubmit = async () => {
    const trimmed = commentInput.trim();
    if (!currentUserId || !trimmed) return;

    try {
      await communityApi.createComment({
        post_id: Number(postId),
        user_id: Number(currentUserId),
        content: trimmed,
      });

      setCommentInput("");
      await fetchComments();
    } catch (err) {
      console.error("댓글 등록 실패:", err?.response?.data || err);
      alert("등록 실패");
    }
  };

  const handleReplySubmit = async (parentId) => {
    const trimmed = replyContent.trim();
    if (!currentUserId || !trimmed) return;

    try {
      await communityApi.createComment({
        post_id: Number(postId),
        user_id: Number(currentUserId),
        content: trimmed,
        parent_comment_id: Number(parentId),
      });

      setReplyContent("");
      setReplyingToId(null);
      await fetchComments();
    } catch (err) {
      console.error("답글 등록 실패:", err?.response?.data || err);
      alert("답글 등록 실패");
    }
  };

  const handleEditSubmit = async (id) => {
    const trimmed = editContent.trim();
    if (!currentUserId || !trimmed) return;

    try {
      await communityApi.updateComment(id, {
        content: trimmed,
        user_id: Number(currentUserId),
      });

      setEditingCommentId(null);
      await fetchComments();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("삭제하시겠습니까?")) return;

    try {
      await communityApi.deleteComment(id, currentUserId);
      await fetchComments();
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) return <div className="detail-wrap">로딩 중...</div>;

  return (
    <div className="detail-wrap">
      <div className="detail-hero">
        <button className="back-btn" onClick={() => navigate(-1)}>
          ←
        </button>

        <div className="detail-title-row">
          <span className="detail-chip">{post?.category}</span>
          <h1 className="detail-title">{post?.title}</h1>
        </div>

        <div className="detail-meta">
          <span>👤 {post?.name || "익명"}</span>
          <span>📅 {post?.createdDate?.split("T")[0]}</span>
        </div>
      </div>

      <div className="detail-card">
        <div className="detail-content">{post?.content}</div>
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
          <button className="comment-submit-button" onClick={handleCommentSubmit}>
            등록
          </button>
        </div>

        <div className="comment-list-container">
          {comments.map((c) => {
            const isOwner = c.userId === currentUserId || c.user_id === currentUserId;

            const cId = c.commentId || c.comment_id;

            const isEditing = editingCommentId === cId;
            const isReply = !!(c.parentCommentId || c.parent_comment_id);

            const likeCount = c.commentLikeCount ?? c.comment_like_count ?? 0;

            const likeByMe = likedComments.has(cId);

            return (
              <div
                key={cId}
                className={`comment-card-item ${isReply ? "comment-reply-item" : ""}`}
              >
                <div className="comment-item-header">
                  <span className="comment-author-name">{c.name || "익명"}</span>

                  <div className="comment-header-right">
                    <span className="comment-date-text">{c.createdDate?.split("T")[0]}</span>

                    <div className="comment-owner-btns">
                      {!isEditing && (
                        <button
                          className="btn-reply"
                          onClick={() => {
                            setReplyingToId(cId);
                            setReplyContent("");
                          }}
                        >
                          답글
                        </button>
                      )}

                      {isOwner && !isEditing && (
                        <>
                          <button
                            className="btn-edit"
                            onClick={() => {
                              setEditingCommentId(cId);
                              setEditContent(c.content);
                            }}
                          >
                            수정
                          </button>

                          <button className="btn-delete" onClick={() => handleDelete(cId)}>
                            삭제
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {isEditing ? (
                  <div className="comment-edit-box">
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      />
                      <div className="edit-btn-group">
                      <button
                        className="btn-save-confirm"
                        onClick={() => handleEditSubmit(cId)}
                      >
                          저장
                      </button>
                      <button
                        className="btn-cancel-edit"
                        onClick={() => setEditingCommentId(null)}
                      >
                        취소
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="comment-body-text">{c.content}</p>

                    <div className="comment-footer" style={{ marginTop: "8px" }}>
                      <span
                        className="like-btn"
                        onClick={() => handleLike(cId)}
                        style={{
                          cursor: "pointer",
                          fontWeight: "800",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                          color: likeByMe ? "#ff4d4f" : "#666",
                        }}
                      >
                        {likeByMe ? "❤️" : "🤍"} {likeCount}
                      </span>
                    </div>

                    {replyingToId === cId && (
                      <div className="comment-edit-box reply-input-container">
                        <textarea
                          value={replyContent}
                          onChange={(e) => setReplyContent(e.target.value)}
                        />
                        <div className="edit-btn-group">
                          <button className="btn-save-confirm" onClick={() => handleReplySubmit(cId)}>
                            등록
                          </button>
                          <button className="btn-cancel-edit" onClick={() => setReplyingToId(null)}>
                            취소
                          </button>
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
  );
}

export default CommunityDetail;
