import React, { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import "../../assets/css/Community/CommunityPost.css"
import { communityApi } from '../../api/communityApi'

function CommunityPost() {//글 작성

  const navigate = useNavigate()

  const [category, setCategory] = useState("")
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [attachments, setAttachments] = useState([]);


  const categories = useMemo(
    () => ["전체", "공문사칭", "결제사기", "지인사칭", "보안/케어", "기타", "피싱예방", "피해복구", "최신수법", "기관공지", "자유게시판", "질문 답변"],
    []
  )

  const validate = () => {
    if (!category) return "카테고리를 선택해주세요."
    if (!title.trim()) return "제목을 입력해주세요."
    if (!content.trim()) return "내용을 입력해주세요."
    return "";
  }

  const onPickFiles = (e) => {
    const files = Array.from(e.target.files || []);
    const merged = [...attachments, ...files].slice(0, 5);
    setAttachments(merged);
  };

  const removeFile = (idx) => {
    setAttachments((prev) => prev.filter((_, i) => i !== idx))
  }

  const onSubmit = async () => {
    setError("");
    const msg = validate();
    if (msg) {
      setError(msg);
      return;
    }
    setLoading(true);
    try {
      const res = await communityApi.createPost({
        title: title.trim(),
        content: content.trim(),
        category,
        userId,
      });
      const createdId = res?.post_id ?? res?.postId;
      if (createdId) navigate(`/community/${createdId}`);
      else navigate("/community");
    } catch (e) {
      setError("작성에 실패했어요. 잠시 후 다시 시도해 주세요.");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className='community-page'>
      <div className='community-header'>
        <h1>피해 사례 작성</h1>
        <p className='community-subtitle'>실제로 받은 문자/링크/상황을 공유하면, 다른 사람을 지킬 수 있습니다.</p>
      </div>

      <div className='chip-row write-chip-row'>
        {categories.map((c) => (
          <button key={c} className={`chip ${category === c ? "active" : ""}`}
            onClick={() => setCategory(category === c ? "" : c)}
            type="button"
          >{c}</button>
        ))}
      </div>

      <div className='write-card'>
        <label className='write-label'>제목</label>
        <input className='write-input' value={title} onChange={(e) => setTitle(e.target.value)} placeholder='예) [지인사칭] 지인사칭을 통해서 거금을 요구받았는데 조심하세요! ' maxLength={200} />
        <div className='write-hint'>{title.length}/200</div>

        <label className='write-label'>내용</label>
        <textarea className='write-textarea' value={content} onChange={(e) => setContent(e.target.value)} placeholder={`• 언제/어디서 어떤 메시지를 받았나요?\n• 포함된 링크/번호/문구가 있나요?\n• 피해가 있었다면 어떤 방식이었나요?\n\n(개인정보/계좌번호 등 민감정보는 쓰지 마세요.)`}
          rows={10}
        />

        <div className="attach-row">
          <div className="attach-left">
            <label className="attach-btn" htmlFor="attach-input">
              📎 첨부(최대 5개)
            </label>
            <input
              id="attach-input"
              type="file"
              accept="image/*"
              multiple
              onChange={onPickFiles}
              style={{ display: "none" }}
            />
            <span className="attach-hint">스크린샷/이미지 첨부(선택)</span>
          </div>
        </div>

        {attachments.length > 0 && (
          <div className="attach-list">
            {attachments.map((f, idx) => (
              <div className="attach-item" key={`${f.name}-${idx}`}>
                <span className="attach-name">{f.name}</span>
                <button
                  className="attach-remove"
                  type="button"
                  onClick={() => removeFile(idx)}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        {error && <div className="write-error">{error}</div>}

        {/* 하단 버튼 */}
        <div className="write-actions">
          <button
            className="btn-ghost"
            type="button"
            onClick={() => navigate(-1)}
            disabled={loading}
          >
            취소
          </button>
          <button
            className="btn-primary"
            type="button"
            onClick={onSubmit}
            disabled={loading}
          >
            {loading ? "작성 중..." : "작성"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CommunityPost
