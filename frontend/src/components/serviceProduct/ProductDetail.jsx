import React, { useEffect } from 'react'
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom'
import { getProductDetail } from '../../api/productAPI';
import "../../assets/css/ServiceProduct/ProductDetail.css"

function ProductDetail() {

    const { productId } = useParams();
    const navigate = useNavigate()

    const [product, setProduct] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [showPlanModal, setShowPlanModal] = useState(false)
    const [selectedPlan, setSelectedPlan] = useState(null)
    const [activeTab, setActiveTab] = useState('intro')

    useEffect(() => {
        let alive = true;

        const fetchProduct = async () => {
            try {
                setLoading(true);
                const data = await getProductDetail(productId);
                if (!alive) return;
                setProduct(data)
                // 기본 플랜 선택
                if (data.plans && data.plans.length > 0) {
                    setSelectedPlan(data.plans[0])
                }
            } catch (e) {
                console.error(e)
                if (!alive) return
                setError("상품 정보를 불러오지 못했습니다.")
            } finally {
                if (!alive) return;
                setLoading(false)
            }
        }
        fetchProduct()
        return () => {
            alive = false;
        }
    }, [productId]);

    const handleSubscribe = () => {
        if (!selectedPlan) {
            alert('구독 플랜을 선택해주세요.')
            return
        }
        // 구독 처리 로직
        console.log('구독하기:', selectedPlan)
    }

    if (loading) {
        return (
            <div className='sp-bg'>
                <div className='sp-shell'>
                    <div className='sp-detail-loading'>로딩 중...</div>
                </div>
            </div>
        )
    }

    if (error || !product) {
        return (
            <div className='sp-bg'>
                <div className='sp-shell'>
                    <div className='sp-detail-error'>{error ?? "상품을 찾을 수 없습니다."}</div>
                    <button className='sp-back-btn' onClick={() => navigate(-1)}>← 뒤로</button>
                </div>
            </div>
        )
    }

    const API_BASE = "";
    const imageFullUrl = (url) => (url && url.trim() ? (url.startsWith("http") ? url : `${API_BASE}${url.startsWith("/") ? "" : "/"}${url}`) : null);

    const imageStyle = product.mainImage
        ? {
            backgroundImage: `url(${imageFullUrl(product.mainImage)})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
        }
        : {
            background:
                "linear-gradient(135deg, rgba(70,90,200,0.4), rgba(180,70,140,0.3))",
        };

    return (
        <div className='sp-bg'>
            <div className='sp-shell'>
                <button className='sp-back-btn' onClick={() => navigate(-1)}>← 뒤로</button>

                <div className='sp-detail-container sp-glass'>
                    {/* 상품 카드 */}
                    <div className='sp-product-card'>
                        <div className='sp-product-card-inner' style={imageStyle}>
                            {/* 상품 정보 오버레이 */}
                            <div className='sp-product-overlay'>
                                <h1 className='sp-product-name'>{product.name}</h1>

                                <div className='sp-product-rating'>
                                    <span className='sp-star'>★ {Number(product.rating).toFixed(1)}</span>
                                    <span className='sp-reviews'>({product.reviewCount}명)</span>
                                </div>

                                <p className='sp-product-desc'>{product.description}</p>

                                {/* 가격 및 구독 버튼 */}
                                <div className='sp-product-action'>
                                    <div className='sp-product-price'>
                                        {product.priceType === "FREE" ? (
                                            <span className='sp-free'>무료</span>
                                        ) : (
                                            <>
                                                <span className='sp-price-label'>월</span>
                                                <span className='sp-price-amount'>{product.price.toLocaleString()}</span>
                                                <span className='sp-price-unit'>원</span>
                                            </>
                                        )}
                                    </div>

                                    <button className='sp-subscribe-button' onClick={() => setShowPlanModal(true)}>
                                        🛒 구독 신청
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 탭 메뉴 */}
                    <div className='sp-tabs'>
                        <button
                            className={`sp-tab-button ${activeTab === 'intro' ? 'active' : ''}`}
                            onClick={() => setActiveTab('intro')}
                        >
                            서비스 소개
                        </button>
                        <button
                            className={`sp-tab-button ${activeTab === 'reviews' ? 'active' : ''}`}
                            onClick={() => setActiveTab('reviews')}
                        >
                            이용 후기
                        </button>
                    </div>

                    {/* 탭 컨텐츠 */}
                    <div className='sp-tab-content'>
                        {activeTab === 'intro' ? (
                            <div className='sp-intro-content'>
                                {product.description ? (
                                    <p style={{ whiteSpace: "pre-wrap", lineHeight: "1.8" }}>{product.description}</p>
                                ) : (
                                    <p>서비스 소개 내용이 없습니다.</p>
                                )}
                                {product.features && product.features.length > 0 && (
                                    <ul className='sp-features-list'>
                                        {product.features.map((feature, idx) => (
                                            <li key={idx}>{feature}</li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        ) : (
                            <div className='sp-reviews-content'>
                                <p>이용 후기가 여기에 표시됩니다.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* 구독 플랜 선택 모달 */}
            {showPlanModal && (
                <div className='sp-modal-backdrop' onClick={() => setShowPlanModal(false)}>
                    <div className='sp-modal' onClick={(e) => e.stopPropagation()}>
                        <div className='sp-modal-header'>
                            <h3>기간 플랜 선택</h3>
                            <button className='sp-modal-close' onClick={() => setShowPlanModal(false)}>×</button>
                        </div>

                        <div className='sp-modal-body'>
                            {/* 플랜 옵션들 */}
                            {product.plans && product.plans.map((plan) => (
                                <label key={plan.id} className='sp-plan-option'>
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
                                </label>
                            ))}

                            {/* 결제 정보 */}
                            <div className='sp-payment-summary'>
                                <div className='sp-summary-row'>
                                    <span>총 결제 금액</span>
                                    <strong>
                                        {selectedPlan?.price ? `${selectedPlan.price.toLocaleString()}원` : '미정'}
                                    </strong>
                                </div>
                                <div className='sp-summary-row'>
                                    <span>무료 체험</span>
                                    <strong>무료 체험없이 바로결제</strong>
                                </div>
                                <div className='sp-summary-row'>
                                    <span>정기 결제주기</span>
                                    <strong>{selectedPlan?.period || '-'}</strong>
                                </div>
                                <div className='sp-summary-row'>
                                    <span>결제 수단</span>
                                    <strong>신용카드 / 체크카드(****1234)</strong>
                                </div>
                            </div>

                            {/* 체크박스 */}
                            <label className='sp-checkbox-label'>
                                <input type='checkbox' />
                                <span>자동 정기결제를 동의 (해지요금 없음)</span>
                            </label>
                        </div>

                        <div className='sp-modal-footer'>
                            <button className='sp-modal-btn sp-btn-subscribe' onClick={handleSubscribe}>
                                가입하기
                            </button>
                            <button className='sp-modal-btn sp-btn-cancel' onClick={() => setShowPlanModal(false)}>
                                취소
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ProductDetail
