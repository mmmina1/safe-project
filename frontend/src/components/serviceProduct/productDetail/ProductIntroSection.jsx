import React from 'react'
import '../../../assets/css/ServiceProduct/ProductDetail.css'


function ProductIntroSection({description, detailDesc, features}) {
  return (
    <div className='sp-intro-content'>
      <h3 className='sp-section-title'>서비스 상세 설명</h3>

        <p className='sp-section-desc'>
          {detailDesc || description || '상세 설명이 없습니다.'}
        </p>

        {Array.isArray(features) && features.length > 0 && (
          <ul className='sp-features-list'>
            {features.map((feature, idx) => (
              <li key={idx}>{feature}</li>
            ))}
          </ul>
        )}
    </div>
  )
}

export default ProductIntroSection
