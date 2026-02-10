import React, { useEffect, useState } from 'react'
import '../../../assets/css/ServiceProduct/ProductReview.css'
// updateProductReview API가 필요합니다.
import { getProductReviews, createProductReview, deleteProductReview, updateProductReview, toggleReviewLike  } from '../../../api/reviewApi'

function ProductReviewsSection({ productId, onAvgChange }) {
  const [loading, setLoading] = useState(true)
  const [reviews, setReviews] = useState([])
  const [pageInfo, setPageInfo] = useState({ page: 0, size: 10, totalPages: 0, totalElements: 0 })
  const [err, setErr] = useState(null)

  // 작성 및 수정 폼 상태
  const [form, setForm] = useState({ rating: 5.0, title: '', content: '' })
  const [submitting, setSubmitting] = useState(false)
  const [showWriteForm, setShowWriteForm] = useState(false)
  const [editingReviewId, setEditingReviewId] = useState(null) // 현재 수정 중인 리뷰 ID (null이면 작성 모드)
  const [likeBusy, setLikeBusy] = useState({})

  //점수 평균
  const [avgRating, setAvgRating] = useState(0);

  //로그인 유저 token 받기
  const getUserIdFromToken = () => {
  const token = localStorage.getItem("accessToken");
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload?.sub ? String(payload.sub) : null; // sub = userId
    } catch {
      return null;
    }
  };

  const [userId, setUserId] = useState(() => getUserIdFromToken());

  const fetchPage = async (page = 0) => {
    try {
      setLoading(true)
      setErr(null)

      const data = await getProductReviews(productId, { page, size: pageInfo.size })
      const list = data.content ?? [];
      setReviews(list);

      // 현재 페이지 리뷰 기준 평균
      const avg =
        list.length > 0
          ? list.reduce((sum, r) => sum + Number(r.rating ?? 0), 0) / list.length
          : 0;

      setAvgRating(avg);
      onAvgChange?.(avg) //부모에게 전달

      setPageInfo(prev => ({
        ...prev,
        page: data.number ?? page,
        totalPages: data.totalPages ?? 0,
        totalElements: data.totalElements ?? 0,
      }));
    } catch (e) {
      console.error(e);
      setErr('리뷰를 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!productId) return
    fetchPage(0)
    setUserId(getUserIdFromToken());
  }, [productId])

  // 폼 초기화 함수
  const resetForm = () => {
    setForm({ rating: 5.0, title: '', content: '' })
    setEditingReviewId(null)
    setShowWriteForm(false)
  }

  // 등록 및 수정 통합 제출
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
      const reviewData = {
        rating: Number(r.toFixed(1)),
        title: form.title?.trim() || null,
        content: form.content.trim(),
      }

      if (editingReviewId) {
        // [수정 요청]
        await updateProductReview(productId, editingReviewId, reviewData)
        alert('리뷰가 수정되었습니다!')
      } else {
        // [신규 등록 요청]
        await createProductReview(productId, reviewData)
        alert('리뷰가 등록되었습니다!')
      }

      resetForm()
      // 수정일 경우 현재 페이지 유지, 새 글일 경우 1페이지로 이동
      await fetchPage(editingReviewId ? pageInfo.page : 0)
    } catch (e) {
      console.error(e)
      alert('요청 실패: ' + (e?.response?.data?.message ?? e.message))
    } finally {
      setSubmitting(false)
    }
  }

  // 별점 렌더링
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

  // 수정 버튼 클릭 시: 데이터를 폼에 채우고 상단으로 이동
  const onEdit = (review) => {
    setEditingReviewId(review.reviewId)
    setForm({
      rating: review.rating,
      title: review.title || '',
      content: review.content
    })
    setShowWriteForm(true)
    // 폼이 있는 곳으로 부드럽게 스크롤
    window.scrollTo({ top: 200, behavior: 'smooth' })
  }

  const onDelete = async (reviewId) => {
    if (!window.confirm("정말 이 리뷰를 삭제할까요?")) return
    try {
      await deleteProductReview(productId, reviewId)
      alert("리뷰가 삭제 되었습니다.")
      fetchPage(pageInfo.page)
    } catch (e) {
      alert("리뷰 삭제 실패")
    }
  }

  const onToggleLike = async(reviewId) => {
    if(!userId){
      alert("로그인 후 이용해주세요.")
      return
    }
    if(likeBusy[reviewId]) return

    const prev = reviews.find(r => r.reviewId === reviewId)
    const prevLiked = !!prev?.likeByMe

    setReviews(list =>
      list.map(r => r.reviewId === reviewId
        ? { ...r, likeByMe: !prevLiked, likeCount: (r.likeCount ?? 0) + (prevLiked ? -1 : 1) }
        : r
      )
    )

    try{
      setLikeBusy(prev => ({...prev, [reviewId]: true}))

      const res = await toggleReviewLike(productId,reviewId)

      //서버가 최신
    if (res && typeof res === 'object' && ('likeCount' in res || 'likeByMe' in res)) {
      setReviews(list =>
        list.map(r =>
          r.reviewId === reviewId
          ? {
                ...r,
                likeCount: (res.likeCount ?? r.likeCount),
                likeByMe: (res.likeByMe ?? r.likeByMe),
              }
            : r
        )
      )  
      return
    
    }

    // 서버 응답 형태가 애매할 경우
    await fetchPage(pageInfo.page)
    } catch(e) {
      console.error(e)

      setReviews(list =>
      list.map(r => r.reviewId === reviewId
        ? { ...r, likeByMe: prevLiked, likeCount: (r.likeCount ?? 0) + (prevLiked ? 1 : -1) }
        : r
      )
    ) 
      alert("좋아요 처리 실패 : " + (e?.response?.data?.message ?? e.message))
    }finally{
      setLikeBusy(prev => ({...prev, [reviewId]: false}))
    }
  }

  return (
    <div className='sp-reviews-wrapper'>
      <h3 className='sp-reviews-title'>고객 리뷰</h3>

      {/* 리뷰 요약 카드 */}
      <div className='sp-review-summary-card'>
        <div className='sp-summary-rating'>
          <div className='sp-rating-number'>{avgRating.toFixed(1)}</div>
          <div className='sp-rating-stars'>{renderStars(avgRating)}</div>
          <div className='sp-rating-count'>{pageInfo.totalElements}개의 평가</div>
        </div>
        
        <button 
          className={`sp-write-review-btn ${editingReviewId ? 'editing' : ''}`}
          onClick={() => {
            if (editingReviewId) {
              if (window.confirm("수정을 취소하시겠습니까?")) resetForm()
            } else {
              setShowWriteForm(!showWriteForm)
            }
          }}
        >
          <span className='sp-btn-icon'>{editingReviewId ? '✖' : '✍️'}</span>
          <span>{editingReviewId ? '수정 취소' : '리뷰 작성하기'}</span>
        </button>
      </div>

      {/* 작성/수정 폼 통합 */}
      {showWriteForm && (
        <div className="sp-review-write-card">
          <div className='sp-write-header'>
            <h4>{editingReviewId ? '리뷰 수정하기' : '리뷰 작성'}</h4>
            <button className='sp-close-btn' onClick={resetForm} aria-label='닫기'>✕</button>
          </div>

          <div className='sp-write-body'>
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

            <div className='sp-input-group'>
              <input
                type='text'
                placeholder="제목 (선택사항)"
                value={form.title}
                onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
                className='sp-input'
              />
            </div>

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

            <button className="sp-submit-btn" onClick={onSubmit} disabled={submitting} >
              {submitting ? (
                <>
                  <span className='sp-spinner-sm'></span>
                  <span>처리 중...</span>
                </>
              ) : (
                <>
                  <span>{editingReviewId ? '수정 완료' : '리뷰 등록'}</span>
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
          <div className="sp-loading-state"><p>리뷰를 불러오는 중...</p></div>
        ) : err ? (
          <div className="sp-error-state"><p>{err}</p></div>
        ) : reviews.length === 0 ? (
          <div className="sp-empty-state"><p>첫 번째 리뷰를 작성해보세요!</p></div>
        ) : (
          <>
            <div className='sp-review-grid'>
              {reviews.map(r => (
                <div key={r.reviewId} className="sp-review-card">
                  <div className='sp-review-header'>
                    <div className='sp-reviewer-info'>
                      <div className='sp-reviewer-avatar'>{(r.writerName ?? '익명')[0].toUpperCase()}</div>
                      <div className='sp-reviewer-details'>
                        <div className='sp-reviewer-name'>{r.writerName ?? '익명'}</div>
                        <div className='sp-review-date'>
                          {r.createdDate ? new Date(r.createdDate).toLocaleDateString() : ''}
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
                    <button className={`sp-like-btn-small ${r.likeByMe ? 'active' : ''}`}
                      onClick={() => onToggleLike(r.reviewId)} disabled={!!likeBusy[r.reviewId]} >
                      <span className='sp-like-icon'>👍</span>
                      <span>
                        도움돼요 {r.likeCount ?? 0}
                      </span>
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

            {/* 페이징 생략 (기존과 동일) */}
            {pageInfo.totalPages > 1 && (
              <div className='sp-pagination'>
                <button
                  className="sp-page-btn"
                  onClick={() => fetchPage(Math.max(0, pageInfo.page - 1))}
                  disabled={pageInfo.page <= 0}
                > 이전 </button>
                <div className='sp-page-info'>{pageInfo.page + 1} / {pageInfo.totalPages}</div>
                <button
                  className="sp-page-btn"
                  onClick={() => fetchPage(Math.min(pageInfo.totalPages - 1, pageInfo.page + 1))}
                  disabled={pageInfo.page >= pageInfo.totalPages - 1}
                > 다음 </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default ProductReviewsSection