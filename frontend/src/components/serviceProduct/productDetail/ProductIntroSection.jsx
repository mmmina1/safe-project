import React from 'react'
import '../../../assets/css/ServiceProduct/ProductInfo.css'

function ProductIntroSection({description, detailDesc, features, imageUrl}) {

  const productText = (detailDesc || description || '상세 설명이 없습니다.').trim()

  return (
    <div className='sp-intro-content'>
      <div className='sp-intro-hero-improved'>
        {imageUrl ? (
          <div 
            className='sp-intro-heroImg-improved' 
            style={{ backgroundImage: `url(${imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
            aria-label='product visual'
          />
        ) : (
          /* 이미지가 없을 때 기본 아이콘 */
          <div className='sp-intro-heroImg-improved sp-intro-heroImg--fallback'>
            <span className='sp-placeholder-icon'>🛡️</span>
          </div>
        )}

        <div className='sp-intro-heroBody-improved'>
          <h3 className='sp-section-title-improved'>
            <span className='sp-title-icon'>📋</span>
            서비스 상세 설명
          </h3>
          <p className='sp-section-desc-improved'>{productText}</p>
          
          <div className='sp-pillRow-improved'>
            <span className='sp-pill-improved'>
              <span className='sp-pill-icon'>🔍</span>
              실시간 분석
            </span>
            <span className='sp-pill-improved'>
              <span className='sp-pill-icon'>⚠️</span>
              위험 경고 알림
            </span>
            <span className='sp-pill-improved'>
              <span className='sp-pill-icon'>🛡️</span>
              피싱/스미싱 예방
            </span>
          </div>
        </div>
      </div>

      <div className='sp-common-info-improved'>
        <div className='sp-common-head-improved'>
          <h4>
            <span className='sp-head-icon'>ℹ️</span>
            서비스 이용 안내
          </h4>
          <span className='sp-common-badge-improved'>Risk Watch</span>
        </div>

        <div className='sp-notice-box'>
          <div className='sp-notice-icon'>💡</div>
          <div className='sp-notice-content'>
            <p className='sp-notice-title'>디지털 서비스 안내</p>
            <p className='sp-notice-text'>
              실물 배송이 없는 디지털 서비스입니다. 결제 후 즉시 이용하실 수 있습니다.
            </p>
          </div>
        </div>

        <div className='sp-guide-grid'>
          <div className='sp-guide-card'>
            <div className='sp-guide-header'>
              <span className='sp-guide-icon'>💻</span>
              <h5 className='sp-guide-title'>이용 방법</h5>
            </div>
            <ul className='sp-guide-list'>
              <li>웹과 모바일에서 사용 가능</li>
              <li>별도 설치 없이 바로 이용</li>
              <li>요금제에 따라 제공 범위가 다름</li>
            </ul>
          </div>

          <div className='sp-guide-card'>
            <div className='sp-guide-header'>
              <span className='sp-guide-icon'>🔒</span>
              <h5 className='sp-guide-title'>보안 및 개인정보</h5>
            </div>
            <ul className='sp-guide-list'>
              <li>입력 데이터는 안전하게 처리됩니다</li>
              <li>분석 결과는 예방 목적으로 제공</li>
              <li>무료 플랜은 일부 기능 제한 가능</li>
            </ul>
          </div>
        </div>
      </div>

      {/* 주요 기능 (더 명확하게) */}
      {Array.isArray(features) && features.length > 0 && (
        <div className='sp-features-section'>
          <h4 className='sp-features-title'>
            <span className='sp-features-icon'>⭐</span>
            주요 기능
          </h4>
          <ul className='sp-features-list-improved'>
            {features.map((feature, idx) => (
              <li key={idx} className='sp-feature-item-improved'>
                <span className='sp-check-icon'>✓</span>
                <span className='sp-feature-text'>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default ProductIntroSection