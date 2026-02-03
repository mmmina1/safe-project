import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getProductDetail } from '../../../api/productAPI'
import "../../../assets/css/ServiceProduct/ProductDetail.css";

function ProductDetail() {
  const { productId } = useParams()
  const navigate = useNavigate()

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [showPlanModal, setShowPlanModal] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState(null) // 아직 API 없으면 null 유지
  const [activeTab, setActiveTab] = useState('intro')
  const [agreed, setAgreed] = useState(false)

  useEffect(() => {
    let alive = true

    const fetchProduct = async () => {
      try {
        setLoading(true)
        setError(null)

        const data = await getProductDetail(productId)
        if (!alive) return

        const normalized = {
          ...data,
          rating: data?.rating ?? 0,
          reviewCount: data?.reviewCount ?? 0,
          price: data?.price ?? 0,
          description: data?.description ?? '',
          detailDesc: data?.detailDesc ?? data?.detailedDescription ?? '',
          categoryName: data?.categoryName ?? '서비스',
          plans: Array.isArray(data?.plans) ? data.plans : [] 
        }

        setProduct(normalized)

       if (normalized.plans.length > 0) setSelectedPlan(normalized.plans[0])
        else setSelectedPlan(null)
      } catch (e) {
        console.error(e)
        if (!alive) return
        setError("상품 정보를 불러오지 못했습니다.")
      } finally {
        if (!alive) return
        setLoading(false)
      }
    }

    fetchProduct()
    return () => { alive = false }
  }, [productId])

  const handleSubscribe = () => {
    //지금 DB/백엔드에 플랜이 없으면 구독을 막는 게 맞음
    if (!product?.plans || product.plans.length === 0) {
      alert('현재 구독 플랜 정보가 준비되지 않았습니다.')
      return
    }
    if (!selectedPlan) {
      alert('구독 플랜을 선택해주세요.')
      return
    }
    if (!agreed) {
      alert('자동 정기결제에 동의해주세요.')
      return
    }

    console.log('구독하기:', selectedPlan)
  }

  if (loading) {
    return (
      <div className='sp-bg'>
        <div className='sp-shell'>
          <div className='sp-detail-loading'>
            <div className='sp-spinner'></div>
            <p>로딩 중...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className='sp-bg'>
        <div className='sp-shell'>
          <div className='sp-detail-error'>
            <div className='sp-error-icon'>⚠️</div>
            <p>{error ?? "상품을 찾을 수 없습니다."}</p>
          </div>
          <button className='sp-back-btn' onClick={() => navigate(-1)}>← 뒤로</button>
        </div>
      </div>
    )
  }
  
  const isFree = product.priceType === "FREE"
  const displayPrice = isFree ? 0 : (product.price ?? 0)
  const displayRating = Number(product.rating ?? 0)
  const displayReviewCount = Number(product.reviewCount ?? 0)

  return (
    <div className='sp-bg'>
      <div className='sp-shell'>
        <button className='sp-back-btn' onClick={() => navigate(-1)}>
          <span className='sp-back-icon'>←</span>
          <span>뒤로가기</span>
        </button>

        <div className='sp-detail-container sp-glass'>
          {/* 상품 카드 */}
          <div className='sp-product-card'>
                {/* isNew/isPopular은 DB 없으니 조건부로만 */}
                {product.isNew && <span className='sp-badge sp-badge-new'>NEW</span>}
                {product.isPopular && <span className='sp-badge sp-badge-hot'>인기</span>}

              {/* 상품 정보 오버레이 */}
              <div className='sp-product-overlay'>
                <div className='sp-product-header'>
                  <h1 className='sp-product-name'>{product.name}</h1>
                  <button className='sp-like-btn' onClick={(e) => {
                    e.stopPropagation()
                    // 찜하기 로직(별도 API 필요)
                  }}>
                    <span className='sp-like-icon'>♡</span>
                  </button>
                </div>

                <div className='sp-product-meta'>
                  <div className='sp-product-rating'>
                    <span className='sp-star'>★ {displayRating.toFixed(1)}</span>
                    <span className='sp-reviews'>({displayReviewCount}명 평가)</span>
                  </div>
                  <div className='sp-product-category'>
                    <span className='sp-category-badge'>{product.categoryName}</span>
                  </div>
                </div>

                {/* ✅ DB: service_products.description or summary */}
                <p className='sp-product-desc'>{product.description}</p>

                {/* keyFeatures/features는 DB 없으니 있으면만 */}
                {Array.isArray(product.keyFeatures) && product.keyFeatures.length > 0 && (
                  <div className='sp-key-features'>
                    {product.keyFeatures.slice(0, 3).map((feature, idx) => (
                      <div key={idx} className='sp-key-feature-item'>
                        <span className='sp-feature-icon'>✓</span>
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* 가격 및 액션 */}
                <div className='sp-product-action'>
                  <div className='sp-product-price-box'>
                    <div className='sp-product-price'>
                      {isFree ? (
                        <span className='sp-free'>무료</span>
                      ) : (
                        <>
                          <span className='sp-price-label'>월</span>
                          <span className='sp-price-amount'>{displayPrice.toLocaleString()}</span>
                          <span className='sp-price-unit'>원</span>
                        </>
                      )}
                    </div>

                    {/* originalPrice는 DB에 없으니 있으면만 */}
                    {product.originalPrice && product.originalPrice > displayPrice && (
                      <div className='sp-price-discount'>
                        <span className='sp-original-price'>{product.originalPrice.toLocaleString()}원</span>
                        <span className='sp-discount-rate'>
                          {Math.round((1 - displayPrice / product.originalPrice) * 100)}% 할인
                        </span>
                      </div>
                    )}
                  </div>

                  <button className='sp-subscribe-button' onClick={() => setShowPlanModal(true)}>
                    <span className='sp-subscribe-icon'>🛒</span>
                    <span>구독 신청</span>
                  </button>
                </div>
              </div>
          </div>

          {/* 상세 정보 섹션 */}
          <div className='sp-detail-info'>
            {/* 빠른 정보 카드: DB 없으니 임시(있으면 표시) */}
            <div className='sp-quick-info'>
              <div className='sp-info-item'>
                <div className='sp-info-icon'>📦</div>
                <div className='sp-info-content'>
                  <span className='sp-info-label'>재고</span>
                  <span className='sp-info-value'>
                    {product.stockQty != null ? `${product.stockQty}개` : '-'}
                  </span>
                </div>
              </div>
              <div className='sp-info-item'>
                <div className='sp-info-icon'>🏷️</div>
                <div className='sp-info-content'>
                  <span className='sp-info-label'>서비스 등급</span>
                  <span className='sp-info-value'>{product.serviceLevel ?? '-'}</span>
                </div>
              </div>
              <div className='sp-info-item'>
                <div className='sp-info-icon'>✅</div>
                <div className='sp-info-content'>
                  <span className='sp-info-label'>상태</span>
                  <span className='sp-info-value'>{product.status ?? '-'}</span>
                </div>
              </div>
            </div>

            {/* 탭 메뉴 */}
            <div className='sp-tabs'>
              <button
                className={`sp-tab-button ${activeTab === 'intro' ? 'active' : ''}`}
                onClick={() => setActiveTab('intro')}
              >
                <span className='sp-tab-icon'>📋</span>
                <span>서비스 소개</span>
              </button>
              <button
                className={`sp-tab-button ${activeTab === 'reviews' ? 'active' : ''}`}
                onClick={() => setActiveTab('reviews')}
              >
                <span className='sp-tab-icon'>💬</span>
                <span>이용 후기</span>
              </button>
            </div>

            {/* 탭 컨텐츠 */}
            <div className='sp-tab-content'>
              {activeTab === 'intro' ? (
                <div className='sp-intro-content'>
                  <h3 className='sp-section-title'>서비스 상세 설명</h3>

                  {/* ✅ DB: product_detail.detail_desc 우선, 없으면 service_products.description */}
                  <p className='sp-section-desc'>
                    {product.detailDesc || product.description || '상세 설명이 없습니다.'}
                  </p>

                  {/* features는 DB 없으니 있으면만 */}
                  {Array.isArray(product.features) && product.features.length > 0 && (
                    <ul className='sp-features-list'>
                      {product.features.map((feature, idx) => (
                        <li key={idx}>{feature}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ) : (
                <div className='sp-reviews-content'>
                  <h3 className='sp-section-title'>고객 리뷰</h3>

                  {/* ✅ 집계값(평점/리뷰수)만 DB/백엔드에서 내려오면 표시 가능 */}
                  <div className='sp-review-summary'>
                    <div className='sp-review-score'>
                      <span className='sp-score-big'>{displayRating.toFixed(1)}</span>
                      <div className='sp-score-stars'>★★★★★</div>
                      <span className='sp-score-count'>{displayReviewCount}개의 평가</span>
                    </div>
                  </div>

                  {/* ❗ 리뷰 리스트는 별도 API 필요. 지금은 안내만 */}
                  <div className='sp-review-list'>
                    <div className='sp-detail-error' style={{ marginTop: 12 }}>
                      <p>리뷰 목록 API가 준비되면 여기에 실제 리뷰가 표시됩니다.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 구독 플랜 선택 모달 */}
      {showPlanModal && (
        <div className='sp-modal-backdrop' onClick={() => setShowPlanModal(false)}>
          <div className='sp-modal' onClick={(e) => e.stopPropagation()}>
            <div className='sp-modal-header'>
              <h3>
                <span className='sp-modal-icon'>📋</span>
                기간 플랜 선택
              </h3>
              <button className='sp-modal-close' onClick={() => setShowPlanModal(false)}>×</button>
            </div>

            <div className='sp-modal-body'>
              {/* ✅ plans가 없으면 안내 */}
              {(!product.plans || product.plans.length === 0) ? (
                <div className='sp-detail-error'>
                  <p>현재 플랜 정보가 없습니다. (플랜 테이블/API 추가 필요)</p>
                </div>
              ) : (
                <div className='sp-plan-options'>
                  {product.plans.map((plan) => (
                    <label
                      key={plan.id}
                      className={`sp-plan-option ${selectedPlan?.id === plan.id ? 'selected' : ''}`}
                    >
                      <input
                        type='radio'
                        name='plan'
                        checked={selectedPlan?.id === plan.id}
                        onChange={() => setSelectedPlan(plan)}
                      />
                      <div className='sp-plan-info'>
                        <div className='sp-plan-name'>{plan.name}</div>
                        <div className='sp-plan-price'>
                          {plan.price ? `${plan.price.toLocaleString()}원/${plan.period}` : '상담 필요'}
                        </div>
                      </div>
                      {plan.discount && (
                        <div className='sp-plan-badge'>
                          <span className='sp-discount-badge'>{plan.discount}% 할인</span>
                        </div>
                      )}
                    </label>
                  ))}
                </div>
              )}

              <label className='sp-checkbox-label'>
                <input
                  type='checkbox'
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                />
                <span>자동 정기결제를 동의 (해지요금 없음)</span>
              </label>
            </div>

            <div className='sp-modal-footer'>
              <button
                className={`sp-modal-btn sp-btn-subscribe ${!agreed ? 'disabled' : ''}`}
                onClick={handleSubscribe}
                disabled={!agreed}
              >
                <span>가입하기</span>
              </button>
              <button className='sp-modal-btn sp-btn-cancel' onClick={() => setShowPlanModal(false)}>
                취소
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductDetail
