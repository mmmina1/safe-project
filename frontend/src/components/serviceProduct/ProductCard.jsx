import React from 'react'
import { useNavigate } from 'react-router-dom'

function ProductCard({item}) {

    const navigate = useNavigate()

    //db 스키마를 최우선으로 참조
    const id = item.product_id ?? item.productId;
    
    //name 참조
    const title = item.name ?? "상품명 없음";

    //price 참조
    const price = item.price ?? 0;

    const rating = item.rating ?? 0;
    const reviewCount = item.reviewCount ?? 0;

    const imageStyle = item.main_image
        ? {backgroudImage : `url(${item.main_image})`, backgroudSize: 'cover', backgroundPosition: 'center' }
        : {backgroudColor : '#f0f0f0'}//이미지 없을 경우

  return (
    <div className='sp-card sp-glass' onClick={() => navigate(`/product/${id}`)} role='button' tabIndex={0}>
        <div className='sp-thumb' style={imageStyle}/>
            {/* 상품명 */}
            <div className='sp-cardTitle'>{title}

            {/* 평점, 리뷰 */}
            <div className='sp-cardMeta'>
                <span className="sp-star">★ {Number(rating).toFixed(1)}</span>
                <span className="sp-dot">·</span>
                <span className="sp-review">리뷰 {reviewCount}</span>
            </div>

            {/* 가격 정보 */}
            <div className='sp-cardPrice'>
                {item.price_type === 'FREE' ? (
                    <span className='sp-free'>무료</span>
                ):(
                    `${Number(price).toLocaleString()}원`
                )}
            </div>
        </div>

        {/* 찜하기 버튼 (WISHLIST 테이블과 연동될 부분) */}
      <div className="sp-likeFab" onClick={(e) => {
        e.stopPropagation(); // 카드 클릭 이벤트 전파 방지
        // 찜하기
      }}>♡</div>
    </div>
  );
}

export default ProductCard
