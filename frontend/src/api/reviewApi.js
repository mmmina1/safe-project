import axios from 'axios'

// Axios 인스턴스 생성 (인증 토큰 자동 포함)
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// 요청 인터셉터 - 토큰 자동 추가
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken') // 또는 세션 스토리지
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 응답 인터셉터 - 에러 처리
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // 인증 실패 - 로그인 페이지로 리다이렉트
      console.error('인증이 필요합니다.')
      // window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

/**
 * 리뷰 요약 정보 조회
 * @param {number} productId - 상품 ID
 * @returns {Promise} 평균 평점과 총 리뷰 수
 */
export const getProductReviewSummary = async (productId) => {
  try {
    const res = await api.get(`/products/${productId}/reviews/summary`)
    return res.data
  } catch (error) {
    console.error('리뷰 요약 조회 실패:', error)
    throw error
  }
}

/**
 * 리뷰 목록 조회 (페이지네이션)
 * @param {number} productId - 상품 ID
 * @param {Object} params - 페이지 파라미터
 * @param {number} params.page - 페이지 번호 (0부터 시작)
 * @param {number} params.size - 페이지 크기
 * @returns {Promise} 리뷰 목록과 페이지 정보
 */
export const getProductReviews = async (productId, { page = 0, size = 10 } = {}) => {
  try {
    const res = await api.get(`/products/${productId}/reviews`, {
      params: { 
        page, 
        size, 
        sort: 'reviewId,DESC' // 최신순 정렬
      }
    })
    
    // 응답 데이터 구조 확인
    // { content: [...], totalElements: n, totalPages: n, number: n }
    return res.data
  } catch (error) {
    console.error('리뷰 목록 조회 실패:', error)
    throw error
  }
}

/**
 * 리뷰 작성
 * @param {number} productId - 상품 ID
 * @param {Object} payload - 리뷰 데이터
 * @param {number} payload.rating - 평점 (1.0 ~ 5.0)
 * @param {string} payload.title - 리뷰 제목 (선택)
 * @param {string} payload.content - 리뷰 내용 (필수)
 * @returns {Promise} 생성된 리뷰 ID
 */
export const createProductReview = async (productId, payload) => {
  try {
    // 유효성 검사
    if (!payload.content || !payload.content.trim()) {
      throw new Error('리뷰 내용을 입력해주세요.')
    }
    
    const rating = Number(payload.rating)
    if (isNaN(rating) || rating < 1 || rating > 5) {
      throw new Error('평점은 1.0 ~ 5.0 사이여야 합니다.')
    }

    // API 호출
    const res = await api.post(`/products/${productId}/reviews`, {
      rating: Number(rating.toFixed(1)),
      title: payload.title?.trim() || null,
      content: payload.content.trim(),
    })
    
    return res.data // reviewId 반환
  } catch (error) {
    console.error('리뷰 작성 실패:', error)
    throw error
  }
}

/**
 * 리뷰 수정
 * @param {number} productId - 상품 ID
 * @param {number} reviewId - 리뷰 ID
 * @param {Object} payload - 수정할 리뷰 데이터
 * @returns {Promise} 수정된 리뷰 정보
 */
export const updateProductReview = async (productId, reviewId, payload) => {
  try {
    const res = await api.put(`/products/${productId}/reviews/${reviewId}`, payload)
    return res.data
  } catch (error) {
    console.error('리뷰 수정 실패:', error)
    throw error
  }
}

/**
 * 리뷰 삭제
 * @param {number} productId - 상품 ID
 * @param {number} reviewId - 리뷰 ID
 * @returns {Promise} 삭제 결과
 */
export const deleteProductReview = async (productId, reviewId) => {
  try {
    const res = await api.delete(`/products/${productId}/reviews/${reviewId}`)
    return res.data
  } catch (error) {
    console.error('리뷰 삭제 실패:', error)
    throw error
  }
}

/**
 * 리뷰 도움돼요 (좋아요) 토글
 * @param {number} productId - 상품 ID
 * @param {number} reviewId - 리뷰 ID
 * @returns {Promise} 좋아요 결과
 */
export const toggleReviewLike = async (productId, reviewId) => {
  try {
    const res = await api.post(`/products/${productId}/reviews/${reviewId}/like`)
    return res.data
  } catch (error) {
    console.error('리뷰 좋아요 실패:', error)
    throw error
  }
}

export default {
  getProductReviewSummary,
  getProductReviews,
  createProductReview,
  updateProductReview,
  deleteProductReview,
  toggleReviewLike,
}