import React from 'react'

export default function MainHeader({phone, setPhone, onSearch, loading}) {
  return (
    <div className='main-hero'>
        <div className='hero-innner'>
            <h1 className='hero-title'>피싱 전화번호 검색</h1>
            <p className='hero-subtitle'>보이스 피싱으로 의심되는 번호를 조회해보세요.</p>

            <div className='search-box'>
                <input className='search-input' value={phone} onChange={(e) =>setPhone(e.target.value)} placeholder='010-1234-1234'>
                </input>

                <button className='search-btn' onClick={onSearch} disabled={loading}>🔍</button>
            </div>
        </div>
      
    </div>
  )
}