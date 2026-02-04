import React from 'react'
import '../../../assets/css/ServiceProduct/ProductDetail.css'


function ProductReviewsSection({rating, reviewCount}) {
  return (
    <div className='sp-reviews-content'>
      <h3 className='sp-section-title'>고객 리뷰</h3>

      <div className='sp-review-summary'>
        <div className='sp-review-score'>
          <span className='sp-score-big'>{rating.toFixed(1)}</span>
          <div className='sp-score-stars'>★★★★★</div>
          <span className='sp-score-count'>{reviewCount}개의 평가</span>
        </div>
      </div>

      <div className='sp-detail-error' style={{marginTop: 12}}>
        <p>리뷰 목록 API가 준비되면, 여기에 실제 리뷰가 표시됩니다.</p>
      </div>
    </div>
  )
}

export default ProductReviewsSection
