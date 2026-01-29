import React from 'react'

export default function MainHeader({ phone, setPhone, onSearch, loading }) {
  return (
    <div className='main-wrap'>
      <h1 className='main-title'>피싱 전화번호 검색</h1>
      <p className='main-subtitle'>보이스 피싱으로 의심되는 번호를 조회해보세요.</p>

      <div className='search-box'>
        <input
          className='search-input'
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder='010-1234-1234'
        />
        <button className='search-btn' onClick={onSearch} disabled={loading}>🔍</button>
      </div>
    </div>
  )
}

