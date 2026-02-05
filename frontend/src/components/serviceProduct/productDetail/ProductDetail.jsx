import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getProductDetail } from '../../../api/productApi'
import { uploadMainImage } from '../../../api/productApi'
import '../../../assets/css/ServiceProduct/ProductDetail.css'

import ProductQuickInfo from './ProductQuickInfo'
import ProductIntroSection from './ProductIntroSection'
import ProductReviewsSection from './ProductReviewsSection'
import PlanModal from './PlanModal'

function ProductDetail() {
  const { productId } = useParams()
  const navigate = useNavigate()

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [showPlanModal, setShowPlanModal] = useState(false)
  const [activeTab, setActiveTab] = useState('intro')
  const [agreed, setAgreed] = useState(false)

  const handleImageChange = async (e) => {
    const file = e.target.files[0]; // 사용자가 선택한 파일
    if (!file) return;

    try {
      setLoading(true); // 로딩 시작
      
      // 아까 만든 API 함수를 호출!
      const result = await uploadMainImage(productId, file);
      
      //성공하면 화면의 상품 이미지 상태를 업데이트
      setProduct(prev => ({
        ...prev,
        mainImage: result.url // 백엔드에서 준 S3 URL로 교체
      }));
      
      alert("이미지가 성공적으로 변경되었습니다!");
    } catch (error) {
      alert("업로드 실패: " + error.message);
    } finally {
      setLoading(false);
    }
  };

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
          stockQty: data?.stockQty ?? 0,
          summary: data?.summary ?? '',
          description: data?.description ?? '',
          detailDesc: data?.detailDesc ?? data?.detailedDescription ?? '',
          categoryName: data?.categoryName ?? '서비스',
          plan: data?.plan ?? null,
          priceType: data?.priceType ?? 'PAID'
        }

        setProduct(normalized)

      } catch (e) {
        console.error(e)
        if (!alive) return
        setError('상품 정보를 불러오지 못했습니다.')

      } finally {
        if (!alive) return
        setLoading(false)
      }
    }

    fetchProduct()
    return () => {
      alive = false
    }
  }, [productId])

    const handleSubscribe = () => {
      if (!product) return

      // 무료면 plan 없어도 진행 가능하게 할지(선택)
      const isFree = product.priceType === 'FREE'

      if (!isFree && !product.plan) {
        alert('이용기간/가격 정보가 없습니다. (플랜 등록 필요)')
        return
      }

      if (!agreed) {
        alert('이용약관에 동의해주세요.')
        return
      }

      console.log('구독/결제 진행:', {
        productId: product.id,
        period: product.plan?.periodText,
        price: product.plan?.finalPrice,
        priceType: product.priceType,
      })
    }


  if (loading) {
    return (
      <div className="sp-bg">
        <div className="sp-shell">
          <div className="sp-detail-loading">
            <div className="sp-spinner"></div>
            <p>로딩 중...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="sp-bg">
        <div className="sp-shell">
          <div className="sp-detail-error">
            <div className="sp-error-icon">⚠️</div>
            <p className="sp-error-text">{error ?? '상품을 찾을 수 없습니다.'}</p>
          </div>
          <button className="sp-back-btn sp-back-btn-large" onClick={() => navigate(-1)}>
            <span className="sp-back-icon">←</span>
            <span>뒤로가기</span>
          </button>
        </div>
      </div>
    )
  }

  const isFree = product.priceType === 'FREE'
  const displayPrice = isFree ? 0 : product.price ?? 0
  const displayRating = Number(product.rating ?? 0)
  const displayReviewCount = Number(product.reviewCount ?? 0)
  const isOutOfStock = product.stockQty === 0

  return (
    <div className="sp-bg">
      <div className="sp-shell-detail">
        <button className="sp-back-btn sp-back-btn-large" onClick={() => navigate(-1)}>
          <span className="sp-back-icon">←</span>
          <span>뒤로가기</span>
        </button>

        <div className="sp-detail-container sp-glass">
          {/* 상품 카드 */}
          <div className="sp-product-card">
            {product.isNew && <span className="sp-badge sp-badge-new">NEW</span>}
            {product.isPopular && <span className="sp-badge sp-badge-hot">인기</span>}

            <div className="sp-product-overlay">
              <div className="sp-product-header">
                <h1 className="sp-product-name">{product.name}</h1>
                <button
                  className="sp-like-btn"
                  onClick={(e) => {
                    e.stopPropagation()
                  }}
                  aria-label="관심 상품 추가"
                >
                  <span className="sp-like-icon">♡</span>
                </button>
              </div>
              <p className="sp-product-desc">{product.summary}</p>

              <div className="sp-product-meta">
                <div className="sp-product-rating">
                  <span className="sp-star">★ {displayRating.toFixed(1)}</span>
                  <span className="sp-reviews">({displayReviewCount}명 평가)</span>
                </div>
                <div className="sp-product-category">
                  <span className="sp-category-badge">{product.categoryName}</span>
                </div>
              </div>

              {Array.isArray(product.keyFeatures) && product.keyFeatures.length > 0 && (
                <div className="sp-key-features">
                  {product.keyFeatures.slice(0, 3).map((feature, idx) => (
                    <div key={idx} className="sp-key-feature-item">
                      <span className="sp-feature-icon">✓</span>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="sp-product-action">
                <div className="sp-product-price-box">
                  <div className="sp-product-price">
                    {isFree ? (
                      <span className="sp-free">무료</span>
                    ) : (
                      <>
                        <span className="sp-price-label">월</span>
                        <span className="sp-price-amount">{displayPrice.toLocaleString()}</span>
                        <span className="sp-price-unit">원</span>
                      </>
                    )}
                  </div>

                  {product.originalPrice && product.originalPrice > displayPrice && (
                    <div className="sp-price-discount">
                      <span className="sp-original-price">
                        {product.originalPrice.toLocaleString()}원
                      </span>
                      <span className="sp-discount-rate">
                        {Math.round((1 - displayPrice / product.originalPrice) * 100)}% 할인
                      </span>
                    </div>
                  )}
                </div>

                <button className="sp-subscribe-button"
                    onClick={() => setShowPlanModal(true)}
                    disabled={isOutOfStock}
                    aria-disabled={isOutOfStock}
                  >
                    <span className="sp-subscribe-icon" aria-hidden="true">
                      {isOutOfStock ? '🔒' : '🛒'}
                    </span>
                    <span className="sp-subscribe-label">
                      {isOutOfStock ? '재고 소진' : '구독 신청'}
                    </span>
                  </button>
              </div>
            </div>
          </div>

          {/* 상세 정보 섹션 */}
          <div className="sp-detail-info">
            <ProductQuickInfo
              stockQty={product?.stockQty}
              serviceLevel={product?.priceType}
              status={product?.status}
            />

            {/* 탭 메뉴 */}
            <div className="sp-tabs">
              <button
                className={`sp-tab-button sp-tab-button-large${activeTab === 'intro' ? 'active' : ''}`}
                onClick={() => setActiveTab('intro')}
              >
                <span className="sp-tab-icon">📋</span>
                <span className='sp-tab-text'>서비스 소개</span>
              </button>
              <button
                className={`sp-tab-button ${activeTab === 'reviews' ? 'active' : ''}`}
                onClick={() => setActiveTab('reviews')}
              >
                <span className="sp-tab-icon">💬</span>
                <span className='sp-tab-text'>이용 후기</span>
              </button>
            </div>

            {/* 탭 컨텐츠 */}
            <div className="sp-tab-content">
              {activeTab === 'intro' && (
                <ProductIntroSection
                  description={product.description}
                  detailDesc={product.detailDesc}
                  features={product.features}
                  plan={product.plan}
                  priceType={product.priceType}
                  imageUrl={product.mainImage}
                />
              )}

              {activeTab === 'reviews' && (
                <ProductReviewsSection productId={productId} rating={displayRating} reviewCount={displayReviewCount} />
              )}
            </div>
          </div>
        </div>
      </div>

      <PlanModal
        open={showPlanModal} product={product} onClose={() => setShowPlanModal(false)} agreed={agreed}
        setAgreed={setAgreed} onSubscribe={handleSubscribe} />
    </div>
  )
}

export default ProductDetail
