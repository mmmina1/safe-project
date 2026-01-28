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
            {FormData}
        </div>
      
    </div>
  )
}

