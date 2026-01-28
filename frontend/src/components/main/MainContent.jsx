import React from 'react'

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
          <div className="stat-label">문자</div>
          <div className="stat-value">{result.smsCount}</div>
        </div>
      </div>

      <button className='report-btn'>통합 제보하기</button>
    </div>
  )
}

function formatDateTime(v) {
  if (!v) return "";
  return v.replace("T", " ").slice(0, 16);
}

