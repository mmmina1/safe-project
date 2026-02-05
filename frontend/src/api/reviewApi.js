import axios from 'axios'

// 리뷰 요약
export const getProductReviewSummary = async (productId) => {
  const res = await axios.get(`/api/products/${productId}/reviews/summary`)
  return res.data
}

// 리뷰 목록(Pageable)
export const getProductReviews = async (productId, { page = 0, size = 10 } = {}) => {
  const res = await axios.get(`/api/products/${productId}/reviews`, {
    params: { page, size, sort: 'reviewId,DESC' }
  })
  return res.data // { content, totalElements, totalPages ... }
}

// 리뷰 작성
export const createProductReview = async (productId, payload) => {
  // payload: { rating: 4.5, title: "옵션", content: "..." }
  const res = await axios.post(`/api/products/${productId}/reviews`, payload)
  return res.data // reviewId(Long)
  
}
