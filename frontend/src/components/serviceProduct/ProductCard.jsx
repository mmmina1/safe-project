import React from 'react'
import { useNavigate } from 'react-router-dom'
import "../../assets/css/ServiceProduct/ProductCard.css";

function ProductCard({item}) {

    const navigate = useNavigate()

    //db 스키마를 최우선으로 참조
    const id = item.productId ?? item.product_id ?? item.id;
    
    //name 참조
    const title = item.name ?? "상품명 없음";

    //price 참조
    const priceType = item.priceType ?? item.price_type;
    const price = item.price ?? item.monthlyPrice ?? 0;

    const rating = item.rating ?? item.avgRating ?? 0;
    const reviewCount = item.reviewCount ?? item.review_count ?? item.reviewsCount ?? 0;

    const mainImage = item.mainImage ?? item.main_image ?? null;

    const imageStyle = mainImage
        ? { backgroundImage: `url(${mainImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }
        : { backgroundColor: '#2a2f3a' };

  return (
    <div className='sp-card sp-glass' onClick={() => navigate(`/product/${id}`)} role='button' tabIndex={0}>
        <div className='sp-thumb' style={imageStyle}>
            {/* 찜하기 버튼 */}
            <div className="sp-likeFab" onClick={(e) => {
                e.stopPropagation(); // 카드 클릭 이벤트 전파 방지
                // 찜하기
            }}>♡</div>
            </div>

            {/* 상품명 */}
            <div className='sp-cardBody'>
                <div className='sp-cardTitle'>{title}</div>

                {/* 평점, 리뷰 */}
                <div className='sp-cardMeta'>
                    <span className="sp-star">★ {Number(rating).toFixed(1)}</span>
                    <span className="sp-dot">·</span>
                    <span className="sp-review">리뷰 {reviewCount}</span>
                </div>

                {/* 가격 정보 */}
                <div className='sp-cardPrice'>
                    {priceType === 'FREE' ? (
                        <span className='sp-free'>무료</span>
                    ):(
                        <>
                            <span className='sp-priceLabel'>월</span>
                            <span className='sp-priceValue'>{Number(price).toLocaleString()}</span>
                            <span className='sp-priceUnit'>원</span>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
    }
export default ProductCard
