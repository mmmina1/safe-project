import React from 'react'
import '../../../assets/css/ServiceProduct/ProductDetail.css'

function ProductQuickInfo({stockQty,serviceLevel,status}) {//재고 및 등급
  return (
    <div className='sp-quick-info'>
      <div className='sp-info-item'>
        <div className='sp-info-icon'>📦</div>
        <div className='sp-info-content'>
        <div className='sp-info-label'>재고</div>
        <span className='sp-info-value'>
          {stockQty != null ? `${stockQty}개` : '-'}
        </span>
      </div>
    </div>

    <div className='sp-info-item'>
      <div className='sp-info-icon'>🏷️</div>
      <div className='sp-info-content'>
        <span className='sp-info-label'>서비스 등급</span>
        <span className='sp-info-value'>{serviceLevel ?? '-'}</span>
      </div>
    </div>

    <div className='sp-info-item'>
        <div className='sp-info-icon'>✅</div>
        <div className='sp-info-content'>
          <span className='sp-info-label'>상태</span>
          <span className='sp-info-value'>{status ?? '-'}</span>
        </div>
      </div>
    </div>
  )
}

export default ProductQuickInfo