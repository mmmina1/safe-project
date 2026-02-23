import React, { useEffect, useMemo, useState } from 'react'
import '../../../assets/css/ServiceProduct/ProductQna.css'
import { getProductQna, createProductQna } from '../../../api/qnaApi'
import ProductQnaAnswer from './ProductQnaAnswer'
import { getUsersByIds } from '../../../api/userApi'

/* ────────────────────────────────────────
   답글 작성 폼 (관리자 전용)
──────────────────────────────────────── */
function ReplyForm({ qnaId, onSuccess }) {
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    if (!text.trim()) return

    try {
      setLoading(true)
      // TODO: 실제 답글 API 연결
      alert('답글이 등록되었습니다.')
      setText('')
      onSuccess?.()
    } catch {
      alert('답글 등록에 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="sp-reply-form" onSubmit={submit}>
      <div className="sp-reply-label">
        <span className="sp-reply-icon">↩</span> 관리자 답글
      </div>
      <textarea
        className="sp-reply-textarea"
        placeholder="답글을 입력하세요…"
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={3}
      />
      <button className="sp-reply-submit" type="submit" disabled={loading}>
        {loading ? '등록 중…' : '답글 등록'}
      </button>
    </form>
  )
}

/* ────────────────────────────────────────
   문의 아이템 카드
──────────────────────────────────────── */
function QnaItem({ qna, isAdmin, onReplySuccess, writer, currentUserId }) {
  const [open, setOpen] = useState(false)

  const answered = !!(
    qna?.answeredAt ||
    qna?.answered_at ||
    qna?.answer ||
    qna?.answerContent ||
    qna?.reply
  )

  const isPrivate = qna?.isPrivate ?? qna?.is_private ?? false

  // ✅ 작성자 id (리뷰처럼 writerUserId 우선)
  const writerId =
    qna?.writerUserId ??
    qna?.writer_user_id ??
    qna?.writerId ??
    qna?.writer_id ??
    qna?.userId ??
    qna?.user_id ??
    qna?.memberId ??
    qna?.member_id ??
    null

  const writerIdStr = writerId == null ? null : String(writerId)

  // ✅ 이름은 qna에 이미 오면 그걸 최우선 (잘못 매칭 덮어쓰기 방지)
  const nameFromQna = qna?.writerName ?? qna?.userName ?? qna?.nickname ?? null
  const nameFromUser = writer?.name ?? writer?.nickname ?? null
  const writerName = nameFromQna ?? nameFromUser ?? '익명'

  // 프로필도 qna에 있으면 우선
  const profileFromQna = qna?.writerProfileImage ?? qna?.profileImage ?? qna?.profile ?? null
  const profileFromUser = writer?.profileImage ?? writer?.profile ?? null
  const writerProfile = profileFromQna ?? profileFromUser ?? null

  const createdAt =
    qna?.createdAt ??
    qna?.created_at ??
    qna?.createdDate ??
    qna?.created_date ??
    null

  const answeredAt = qna?.answeredAt ?? qna?.answered_at ?? null

  // (선택) 내가 쓴 글 표시하고 싶으면 사용
  const isMine = currentUserId && writerIdStr && String(currentUserId) === writerIdStr

  return (
    <div className={`sp-qna-item ${answered ? 'answered' : 'waiting'} ${open ? 'expanded' : ''}`}>
      <button
        className="sp-qna-item-header"
        onClick={() => setOpen((v) => !v)}
        type="button"
      >
        <div className="sp-qna-item-left">
          <span className={`sp-badge ${answered ? 'done' : 'wait'}`}>
            {answered ? '답변완료' : '대기중'}
          </span>
          {isPrivate && <span className="sp-badge private">🔒 비밀글</span>}

          <span className="sp-qna-itemTitle">{qna?.title ?? '(제목 없음)'}</span>

          <span className="sp-qna-writer">
            {writerProfile ? (
              <img className="sp-qna-writer-avatar" src={writerProfile} alt="profile" />
            ) : (
              <span className="sp-qna-writer-avatar-fallback">
                {(writerName?.[0] ?? '익').toUpperCase()}
              </span>
            )}
            <span className="sp-qna-writer-name">
              {writerName}
              {isMine ? <span style={{ marginLeft: 6, fontSize: 12, opacity: 0.7 }}>(나)</span> : null}
            </span>
          </span>
        </div>
        <span className="sp-chevron">{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div className="sp-qna-item-body">
          <div className="sp-qna-content-block">
            <p className="sp-qna-content-text">{qna?.content ?? qna?.body ?? '(내용 없음)'}</p>
            <span className="sp-qna-meta-date">
              {createdAt ? new Date(createdAt).toLocaleDateString('ko-KR') : ''}
            </span>
          </div>

          {answered && (
            <div className="sp-reply-block">
              <span className="sp-reply-badge">관리자 답변</span>
              <p className="sp-reply-text">{qna?.answer ?? qna?.answerContent ?? qna?.reply ?? ''}</p>
              {answeredAt && (
                <span className="sp-qna-meta-date">
                  {new Date(answeredAt).toLocaleDateString('ko-KR')}
                </span>
              )}
            </div>
          )}

          {isAdmin && !answered && (
            <ReplyForm qnaId={qna?.qnaId ?? qna?.qna_id} onSuccess={onReplySuccess} />
          )}
        </div>
      )}
    </div>
  )
}

/* ────────────────────────────────────────
   메인 컴포넌트
──────────────────────────────────────── */
function ProductQnaSection({ productId }) {
  const isAdmin = false

  // ✅ 리뷰랑 동일: 토큰에서 로그인 유저 id 추출
  const getUserIdFromToken = () => {
    const token = localStorage.getItem('accessToken')
    if (!token) return null
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      return payload?.sub ? String(payload.sub) : null
    } catch {
      return null
    }
  }

  const [currentUserId, setCurrentUserId] = useState(() => getUserIdFromToken())

  const pid = useMemo(() => {
    const n = Number(productId)
    return Number.isFinite(n) ? n : null
  }, [productId])

  const [loading, setLoading] = useState(true)
  const [items, setItems] = useState([])
  const [err, setErr] = useState(null)

  const [usersById, setUsersById] = useState({})

  const [showForm, setShowForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  // ✅ QnA 작성자 id 추출: writerUserId 우선 (리뷰에서 writerUserId 쓰듯)
  const getWriterId = (q) => {
    const id =
      q?.writerUserId ??
      q?.writer_user_id ??
      q?.writerId ??
      q?.writer_id ??
      q?.userId ??
      q?.user_id ??
      q?.memberId ??
      q?.member_id

    return id == null ? null : String(id)
  }

  const normalizeUsersArray = (res) => {
    const raw = res?.data ?? res?.result ?? res
    if (Array.isArray(raw)) return raw
    if (Array.isArray(raw?.content)) return raw.content
    if (Array.isArray(raw?.items)) return raw.items
    if (Array.isArray(raw?.data)) return raw.data
    return []
  }

  const normalizeQnaList = (data) => {
    const raw =
      data?.content ??
      data?.items ??
      data?.data?.content ??
      data?.data ??
      data?.result?.content ??
      data?.result ??
      data

    if (Array.isArray(raw)) return raw
    if (Array.isArray(raw?.content)) return raw.content
    if (Array.isArray(raw?.items)) return raw.items
    return []
  }

  const fetchWritersIfNeeded = async (list) => {
    try {
      // ✅ qna에 writerName이 이미 있는 애들은 굳이 user 조회 안 해도 됨(덮어쓰기 방지)
      const ids = [
        ...new Set(
          list
            .filter((q) => !(q?.writerName || q?.userName || q?.nickname)) // 이름이 없을 때만 조회
            .map(getWriterId)
            .filter(Boolean)
        ),
      ]

      if (ids.length === 0) return

      // 캐시된 건 제외
      const need = ids.filter((id) => !usersById[id])
      if (need.length === 0) return

      const res = await getUsersByIds(need)
      const arr = normalizeUsersArray(res)

      const map = {}
      for (const u of arr) {
        const uid = u?.id ?? u?.userId ?? u?.user_id ?? u?.memberId ?? u?.member_id
        if (uid != null) map[String(uid)] = u
      }

      if (Object.keys(map).length > 0) {
        setUsersById((prev) => ({ ...prev, ...map }))
      }
    } catch (e) {
      console.error('fetchWritersIfNeeded 실패:', e)
    }
  }

  const fetchQna = async () => {
    try {
      setLoading(true)
      setErr(null)

      if (!pid) {
        setItems([])
        return
      }

      const data = await getProductQna(pid)
      const list = normalizeQnaList(data)

      setItems(list)
      await fetchWritersIfNeeded(list)
    } catch (e) {
      console.error(e)
      setErr('문의 정보를 불러오지 못했습니다.')
      setItems([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setCurrentUserId(getUserIdFromToken())
    fetchQna()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pid])

  const submitQna = async ({ title, content, isPrivate }) => {
    try {
      if (!pid) {
        alert('상품 정보가 올바르지 않습니다.')
        return false
      }

      setSubmitting(true)

      await createProductQna(pid, { title, content, isPrivate })

      alert('문의가 등록되었습니다.')
      setShowForm(false)
      await fetchQna()
      return true
    } catch (e) {
      console.error(e)
      alert('문의 등록에 실패했습니다.')
      return false
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="sp-qna sp-qna-loading">
        <div className="sp-spinner" />
        <span>불러오는 중…</span>
      </div>
    )
  }

  if (err) return <div className="sp-qna sp-qna-error">{err}</div>

  return (
    <div className="sp-qna">
      <div className="sp-qna-header">
        <div className="sp-qna-title">
          <span className="sp-qna-title-icon">💬</span>
          상품 문의
          {items.length > 0 && <span className="sp-qna-count">{items.length}</span>}
        </div>

        <button
          className={`sp-qna-writerBtn ${showForm ? 'active' : ''}`}
          onClick={() => setShowForm((v) => !v)}
          type="button"
        >
          {showForm ? '✕ 닫기' : '✏ 문의 작성'}
        </button>
      </div>

      {showForm && <ProductQnaAnswer onSubmit={submitQna} submitting={submitting} />}

      {items.length === 0 ? (
        <div className="sp-qna-empty">
          <span className="sp-qna-empty-icon">🗂</span>
          <span>등록된 문의가 없습니다.</span>
        </div>
      ) : (
        <div className="sp-qna-list">
          {items.map((qna, idx) => {
            const wid = getWriterId(qna)
            return (
              <QnaItem
                key={qna?.qnaId ?? qna?.qna_id ?? `${wid ?? 'no-writer'}-${idx}`}
                qna={qna}
                writer={wid ? usersById[wid] : null}
                currentUserId={currentUserId}
                isAdmin={isAdmin}
                onReplySuccess={fetchQna}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}

export default ProductQnaSection