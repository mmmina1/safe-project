import React, { useState } from 'react'

function ProductFilters({value, onChange}) {

    const [localQ, setLocalQ] = useState(value.q)

    //엔터 키 지원을 위한 핸들러
    const handleKeyDown = (e) => {
        if(e.key === "ENTER"){
            onChange({q:localQ})
        }
    }

  return (
    <div className='sp-glass sp-filterBox'>
        <div className='sp-filterTitle'>필터</div>
            <div className='sp-field'>
            <div className='sp-label'>검색</div>
            <div className='sp-searchRow'>
                <input className='sp-input' value={localQ} onChange={(e) => setLocalQ(e.target.value)} onKeyDown={handleKeyDown} placeholder='서비스/상품 키워드 검색'/>
                <button className='sp-searchBtn' onClick={() => onChange({q:localQ})}>검색</button>
            </div>
        </div>

        <div className='sp-field'>
            <div className='sp-label'>카테고리</div>
            <select className='sp-select' value={value.category} onChange={(e) => onChange({category: e.target.value})}>
                <option value="ALL">전체</option>
                <option value="1">보안</option>
                <option value="2">케어</option>
                <option value="3">구독</option>
                </select>
            </div>

            <div className="sp-field">
                <div className="sp-label">정렬</div>
                <select className="sp-select" value={value.sort} 
                onChange={(e) => onChange({ sort: e.target.value })} >
                    <option value="NEW">최신순</option> 
                    <option value="PRICE_ASC">가격 낮은순</option> 
                    <option value="PRICE_DESC">가격 높은순</option>
            </select>
        </div>
    </div>
);
}

export default ProductFilters
