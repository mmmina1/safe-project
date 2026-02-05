import React, { useEffect, useState } from 'react'
import '../../../assets/css/ServiceProduct/ProductReview.css'
import { getProductReviews, createProductReview } from '../../../api/reviewApi'

function ProductReviewsSection({ productId, rating, reviewCount }) {
  const [loading, setLoading] = useState(true)
  const [reviews, setReviews] = useState([])
  const [pageInfo, setPageInfo] = useState({ page: 0, size: 10, totalPages: 0, totalElements: 0 })
  const [err, setErr] = useState(null)

  // 작성 폼 상태
  const [form, setForm] = useState({ rating: 5.0, title: '', content: '' })
  const [submitting, setSubmitting] = useState(false)
  // const [showWriteForm, setShowWriteForm] = useState(false)

  const fetchPage = async (page = 0) => {
    try {
      setLoading(true)
      setErr(null)
      const data = await getProductReviews(productId, { page, size: pageInfo.size })
      setReviews(data.content ?? [])
      setPageInfo(prev => ({
        ...prev,
        page: data.number ?? page,
        totalPages: data.totalPages ?? 0,
        totalElements: data.totalElements ?? 0,
      }))
    } catch (e) {
      console.error(e)
      setErr('리뷰를 불러오지 못했습니다.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!productId) return
    fetchPage(0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId])

  const onSubmit = async () => {
    if (!form.content.trim()) {
      alert('리뷰 내용을 입력해주세요.')
      return
    }
    const r = Number(form.rating)
    if (Number.isNaN(r) || r < 1 || r > 5) {
      alert('평점은 1~5 사이여야 합니다.')
      return
    }

    try {
      setSubmitting(true)
      await createProductReview(productId, {
        rating: Number(r.toFixed(1)),
        title: form.title?.trim() || null,
        content: form.content.trim(),
      })
      alert('리뷰가 등록되었습니다!')
      setForm({ rating: 5.0, title: '', content: '' })
      await fetchPage(0) // 등록 후 최신 목록
    } catch (e) {
      console.error(e)
      alert('리뷰 등록 실패: ' + (e?.response?.data?.message ?? e.message))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className='sp-reviews-content'>
      <h3 className='sp-section-title'>고객 리뷰</h3>

      {/* 요약 */}
      <div className='sp-review-summary'>
        <div className='sp-review-score'>
          <span className='sp-score-big'>{Number(rating ?? 0).toFixed(1)}</span>
          <div className='sp-score-stars'>★★★★★</div>
          <span className='sp-score-count'>{Number(reviewCount ?? 0)}개의 평가</span>
        </div>
      </div>

      {/* 작성 폼 */}
      <div className="sp-review-write" style={{ marginTop: 14 }}>
        <h4 style={{ marginBottom: 8 }}>리뷰 작성</h4>

        <div style={{ display: 'grid', gap: 8 }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <label style={{ fontWeight: 700 }}>평점</label>
            <input
              type="number"
              min="1"
              max="5"
              step="0.1"
              value={form.rating}
              onChange={(e) => setForm(prev => ({ ...prev, rating: e.target.value }))}
              style={{ width: 120 }}
            />
            <span style={{ opacity: 0.8 }}>(1.0 ~ 5.0)</span>
          </div>

          <input
            placeholder="제목(선택)"
            value={form.title}
            onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
          />

          <textarea
            placeholder="리뷰 내용을 입력하세요"
            rows={4}
            value={form.content}
            onChange={(e) => setForm(prev => ({ ...prev, content: e.target.value }))}
          />

          <button
            className="sp-subscribe-button"
            onClick={onSubmit}
            disabled={submitting}
          >
            {submitting ? '등록 중...' : '리뷰 등록'}
          </button>
        </div>
      </div>

      {/* 목록 */}
      <div style={{ marginTop: 18 }}>
        <h4 style={{ marginBottom: 10 }}>
          리뷰 목록 ({pageInfo.totalElements})
        </h4>

        {loading ? (
          <div className="sp-detail-loading"><p>불러오는 중...</p></div>
        ) : err ? (
          <div className="sp-detail-error"><p>{err}</p></div>
        ) : reviews.length === 0 ? (
          <div className="sp-detail-error"><p>아직 리뷰가 없습니다.</p></div>
        ) : (
          <div style={{ display: 'grid', gap: 12 }}>
            {reviews.map(r => (
              <div key={r.reviewId} className="sp-glass" style={{ padding: 14, borderRadius: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                  <div style={{ fontWeight: 900 }}>
                    {r.writerName ?? '익명'}
                    <span style={{ marginLeft: 10, fontWeight: 700, opacity: 0.9 }}>
                      ★ {Number(r.rating ?? 0).toFixed(1)}
                    </span>
                  </div>
                  <div style={{ opacity: 0.7, fontSize: 13 }}>
                    {r.createdDate ? new Date(r.createdDate).toLocaleString() : ''}
                  </div>
                </div>

                {r.title && <div style={{ marginTop: 6, fontWeight: 800 }}>{r.title}</div>}
                <div style={{ marginTop: 6, whiteSpace: 'pre-wrap' }}>{r.content}</div>

                <div style={{ marginTop: 10, opacity: 0.8, fontSize: 13 }}>
                  도움돼요 {r.likeCount ?? 0}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 페이징 */}
        {!loading && pageInfo.totalPages > 1 && (
          <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
            <button
              className="sp-back-btn"
              onClick={() => fetchPage(Math.max(0, pageInfo.page - 1))}
              disabled={pageInfo.page <= 0}
            >
              이전
            </button>
            <div style={{ alignSelf: 'center', opacity: 0.8 }}>
              {pageInfo.page + 1} / {pageInfo.totalPages}
            </div>
            <button
              className="sp-back-btn"
              onClick={() => fetchPage(Math.min(pageInfo.totalPages - 1, pageInfo.page + 1))}
              disabled={pageInfo.page >= pageInfo.totalPages - 1}
            >
              다음
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductReviewsSection
