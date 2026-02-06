import React, { useEffect, useState } from 'react'
import '../../../assets/css/ServiceProduct/ProductReview.css'
import { getProductReviews, createProductReview, deleteProductReview } from '../../../api/reviewApi'

function ProductReviewsSection({ productId, rating, reviewCount }) {
  const [loading, setLoading] = useState(true)
  const [reviews, setReviews] = useState([])
  const [pageInfo, setPageInfo] = useState({ page: 0, size: 10, totalPages: 0, totalElements: 0 })
  const [err, setErr] = useState(null)

  // 작성 폼 상태
  const [form, setForm] = useState({ rating: 5.0, title: '', content: '' })
  const [submitting, setSubmitting] = useState(false)
  const [showWriteForm, setShowWriteForm] = useState(false)

  const userId = localStorage.getItem("userId")
  console.log("userId:", userId)
  localStorage.getItem("userId")


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
      setShowWriteForm(false)
      await fetchPage(0)
    } catch (e) {
      console.error(e)
      alert('리뷰 등록 실패: ' + (e?.response?.data?.message ?? e.message))
    } finally {
      setSubmitting(false)
    }
  }

  // 별점 렌더링 함수
  const renderStars = (ratingValue) => {
    const stars = []
    const fullStars = Math.floor(ratingValue)
    const hasHalfStar = ratingValue % 1 >= 0.5

    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={`full-${i}`} className="sp-star-icon sp-star-full">★</span>)
    }
    if (hasHalfStar && fullStars < 5) {
      stars.push(<span key="half" className="sp-star-icon sp-star-half">★</span>)
    }
    const emptyStars = 5 - stars.length
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<span key={`empty-${i}`} className="sp-star-icon sp-star-empty">☆</span>)
    }
    return stars
  }

  // 댓글 수정 삭제
  const onEdit = (review) => {
    console.log("수정할 리뷰: ", review)
  }

  const onDelete = async(reviewId)=> {
    if(!window.confirm("정말 이 리뷰를 삭제할까요?")) return
    try{
      await deleteProductReview(productId,reviewId)
      alert("리뷰가 삭제 되었습니다.")
      fetchPage(pageInfo.page)
    }catch(e){
      alert("리뷰 삭제 실패")
    }
  }

  return (
    <div className='sp-reviews-wrapper'>
      <h3 className='sp-reviews-title'>고객 리뷰</h3>

      {/* 리뷰 요약 카드 */}
      <div className='sp-review-summary-card'>
        <div className='sp-summary-rating'>
          <div className='sp-rating-number'>{Number(rating ?? 0).toFixed(1)}</div>
          <div className='sp-rating-stars'>{renderStars(Number(rating ?? 0))}</div>
          <div className='sp-rating-count'>{Number(reviewCount ?? 0)}개의 평가</div>
        </div>
        
        <button 
          className='sp-write-review-btn'
          onClick={() => setShowWriteForm(!showWriteForm)}
        >
          <span className='sp-btn-icon'>✍️</span>
          <span>리뷰 작성하기</span>
        </button>
      </div>

      {/* 작성 폼 (토글) */}
      {showWriteForm && (
        <div className="sp-review-write-card">
          <div className='sp-write-header'>
            <h4>리뷰 작성</h4>
            <button 
              className='sp-close-btn'
              onClick={() => setShowWriteForm(false)}
              aria-label='닫기'
            >
              ✕
            </button>
          </div>

          <div className='sp-write-body'>
            {/* 별점 선택 */}
            <div className='sp-rating-input'>
              <label>평점</label>
              <div className='sp-star-buttons'>
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    type='button'
                    className={`sp-star-btn ${Number(form.rating) >= star ? 'active' : ''}`}
                    onClick={() => setForm(prev => ({ ...prev, rating: star }))}
                  >
                    ★
                  </button>
                ))}
              </div>
              <span className='sp-rating-text'>{Number(form.rating).toFixed(1)}</span>
            </div>

            {/* 제목 */}
            <div className='sp-input-group'>
              <input
                type='text'
                placeholder="제목 (선택사항)"
                value={form.title}
                onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
                className='sp-input'
              />
            </div>

            {/* 내용 */}
            <div className='sp-input-group'>
              <textarea
                placeholder="리뷰 내용을 입력하세요"
                rows={3}
                value={form.content}
                onChange={(e) => setForm(prev => ({ ...prev, content: e.target.value }))}
                className='sp-textarea'
              />
              <div className='sp-char-count'>{form.content.length} / 500</div>
            </div>

            {/* 제출 버튼 */}
            <button
              className="sp-submit-btn"
              onClick={onSubmit}
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <span className='sp-spinner-sm'></span>
                  <span>등록 중...</span>
                </>
              ) : (
                <>
                  <span>리뷰 등록</span>
                  <span className='sp-btn-arrow'>→</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* 리뷰 목록 */}
      <div className='sp-reviews-list'>
        <div className='sp-list-header'>
          <h4>리뷰 목록</h4>
          <span className='sp-review-total'>{pageInfo.totalElements}개</span>
        </div>

        {loading ? (
          <div className="sp-loading-state">
            <div className="sp-spinner"></div>
            <p>리뷰를 불러오는 중...</p>
          </div>
        ) : err ? (
          <div className="sp-error-state">
            <div className='sp-error-icon'>⚠️</div>
            <p>{err}</p>
          </div>
        ) : reviews.length === 0 ? (
          <div className="sp-empty-state">
            <div className='sp-empty-icon'>💬</div>
            <p className='sp-empty-title'>아직 리뷰가 없습니다</p>
            <p className='sp-empty-subtitle'>첫 번째 리뷰를 작성해보세요!</p>
          </div>
        ) : (
          <>
            <div className='sp-review-grid'>
              {reviews.map(r => (
                <div key={r.reviewId} className="sp-review-card">
                  <div className='sp-review-header'>
                    <div className='sp-reviewer-info'>
                      <div className='sp-reviewer-avatar'>
                        {(r.writerName ?? '익명')[0].toUpperCase()}
                      </div>
                      <div className='sp-reviewer-details'>
                        <div className='sp-reviewer-name'>{r.writerName ?? '익명'}</div>
                        <div className='sp-review-date'>
                          {r.createdDate ? new Date(r.createdDate).toLocaleDateString('ko-KR', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          }) : ''}
                        </div>
                      </div>
                    </div>
                    <div className='sp-review-rating'>
                      {renderStars(Number(r.rating ?? 0))}
                      <span className='sp-rating-value'>{Number(r.rating ?? 0).toFixed(1)}</span>
                    </div>
                  </div>

                  {r.title && <div className='sp-review-title-text'>{r.title}</div>}
                  
                  <div className='sp-review-content-text'>{r.content}</div>

                  <div className='sp-review-footer'>
                    <button className='sp-like-btn-small'>
                      <span className='sp-like-icon'>👍</span>
                      <span>도움돼요 {r.likeCount ?? 0}</span>
                    </button>

                    {userId && String(r.writerUserId) === String(userId) && ( 
                      <div className='sp-review-actions'> 
                      <button className='sp-review-edit-btn' onClick={() => onEdit(r)}>수정</button>
                      <button className='sp-review-delete-btn' onClick={() => onDelete(r.reviewId)}>삭제</button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* 페이징 */}
            {pageInfo.totalPages > 1 && (
              <div className='sp-pagination'>
                <button
                  className="sp-page-btn"
                  onClick={() => fetchPage(Math.max(0, pageInfo.page - 1))}
                  disabled={pageInfo.page <= 0}
                >
                  <span className='sp-page-arrow'>←</span>
                  <span>이전</span>
                </button>
                
                <div className='sp-page-info'>
                  <span className='sp-current-page'>{pageInfo.page + 1}</span>
                  <span className='sp-page-separator'>/</span>
                  <span className='sp-total-pages'>{pageInfo.totalPages}</span>
                </div>
                
                <button
                  className="sp-page-btn"
                  onClick={() => fetchPage(Math.min(pageInfo.totalPages - 1, pageInfo.page + 1))}
                  disabled={pageInfo.page >= pageInfo.totalPages - 1}
                >
                  <span>다음</span>
                  <span className='sp-page-arrow'>→</span>
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default ProductReviewsSection