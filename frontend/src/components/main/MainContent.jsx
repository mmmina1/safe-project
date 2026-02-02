import React from 'react'
<<<<<<< HEAD

export default function MainContent({result, errorMsg}) {

    if(errorMsg) {
        return <div className='error-text'>{errorMsg}</div>
    }

    if(!result) return null;

  return (
    <div className='result-wrap'>
        <div className='count-text'>
            <span className='count-number'>{result.totalCount}</span>건의 제보 내역이 있습니다. 
        </div>

        <div className='period-text'>
           🔎 <b>검색기간</b> {result.periodLabel}{" "}
            {formatDateTime(result.periodForm)} ~ {formatDateTime(result.periodTo)}
        </div>

        <div className='stat-grid'>
            <div className='stat-card'>
                <div className='stat-label'>음성</div>
                <div className='stat-value'>{result.voiceCount}</div>
            </div>

            <div className="stat-card">
=======
// 💡 날짜 포맷 함수 추가 (예: 2024. 01. 01)
const formatDateTime = (dateStr) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
};

export default function MainContent({ result, errorMsg }) {

  if (errorMsg) {
    return <div className='error-text'>{errorMsg}</div>
  }

  if (!result) return null;

  return (
    <div className='result-wrap'>
      <div className='count-text'>
        <span className='count-number'>{result.totalCount}</span>건의 제보 내역이 있습니다.
      </div>

      <div className='period-text'>
        🔎 <b>검색기간</b> {result.periodLabel}{" "}
        {formatDateTime(result.periodForm)} ~ {formatDateTime(result.periodTo)}
      </div>

      <div className='stat-grid'>
        <div className='stat-card'>
          <div className='stat-label'>음성</div>
          <div className='stat-value'>{result.voiceCount}</div>
        </div>

        <div className="stat-card">
>>>>>>> b0ab98293bedc6ec51b2aff874dc0d691bf6e534
          <div className="stat-label">문자</div>
          <div className="stat-value">{result.smsCount}</div>
        </div>
      </div>

      <button className='report-btn'>통합 제보하기</button>
    </div>
  )
}
