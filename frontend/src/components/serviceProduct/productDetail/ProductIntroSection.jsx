import React from 'react'
import '../../../assets/css/ServiceProduct/ProductInfo.css'

function ProductIntroSection({description, detailDesc, features, imageUrl}) {

  const productText = (detailDesc || description || '상세 설명이 없습니다.').trim()

  return (
    <div className='sp-intro-content'>
      <div className='sp-intro-hero'>
        {imageUrl ? (
          <div className='sp-intro-heroImg' style={{ backgroundImage: `url(${imageUrl})` }}
            aria-label='product visual'
          />
        ) : (
          <div className='sp-intro-heroImg sp-intro-heroImg--fallback' aria-label='product visual' />
        )}

        <div className='sp-intro-heroBody'>
          <h3 className='sp-section-title'>서비스 상세 설명</h3>
          <p className='sp-section-desc sp-clamp'>{productText}</p>
          
          <div className='sp-pillRow'>
            <span className='sp-pill'>실시간 분석</span>
            <span className='sp-pill'>위험 경고 알림</span>
            <span className='sp-pill'>피싱/스미싱 예방</span>
          </div>
        </div>
      </div>

      <div className='sp-common-info'>
        <div className='sp-common-head'>
          <h4>서비스 이용 안내</h4>
          <span className='sp-common-badge'>Risk Watch</span>
        </div>

        <div className='sp-common-grid'>
          <div className='sp-common-card'>
            <ul className='sp-common-list'>
              <li>실물 배송 없는 디지털 서비스 (결제 후 즉시 이용)</li>
              <li>웹/모바일 환경 제공 (별도 설치 없이 사용)</li>
              <li>상품/요금제에 따라 제공 범위가 달라질 수 있음</li>
            </ul>
          </div>

          <div className='sp-common-card'>
            <div className='sp-common-cardTitle'>보안/개인정보</div>
            <ul className='sp-common-list'>
              <li>입력 데이터는 보안 정책에 따라 안전하게 처리</li>
              <li>분석 결과는 예방 목적의 안내 정보로 제공</li>
              <li>무료 플랜은 일부 기능 제한이 있을 수 있음</li>
            </ul>
          </div>
        </div>
      </div>

    {Array.isArray(features) && features.length > 0 && (
            <>
              <h4 className='sp-subtitle'>주요 기능</h4>
              <ul className='sp-features-list'>
                {features.map((feature, idx) => (
                  <li key={idx}>{feature}</li>
                ))}
              </ul>
            </>
          )}
        </div>
      )
    }
export default ProductIntroSection
