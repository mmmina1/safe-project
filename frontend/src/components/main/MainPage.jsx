import React, { useState } from 'react'
import "../../assets/css/Main.css"
import { searchPhishing } from '../../api/mainApi'

export default function MainPage() {

    const [ phone, setPhone ] = useState("")
    const [ result, setResult ] = useState(null)
    const [ errorMsg, setErrorMsg ] = useState("")
    const [ loading, setLoading ] = useState(false)

    const onSearch = async() => {
        setErrorMsg("")
        setLoading(true)

        try {
            const res = await searchPhishing(phone)
            if(!res.success) {
                setResult(null)
                setErrorMsg(res.message || "조회에 실패했습니다.")
                return
            }
            setResult(res.data)
        } catch (e) {
            setResult(null)
            setErrorMsg("서버 연결에 실패했습니다.")
        } finally{
            setLoading(false)
        }
    }


  return (
    <div className='main-wrap'>
        <h1 className='main-title'>피싱 전화번호 검색</h1>
        <p className='main-subtitle'>보이스피싱으로 의심되는 번호를 조회해보세요.</p>
      
        <div className='search-box'>
            <input className='search-put' value={phone} onChange={(e) => setPhone(e.target.value)} placeholder='010-1234-1234'/>
            <button className='search-btn' onClick={onSearch} disabled={loading}>🔍</button>
        </div>

        {errorMsg && <div className='error-text'>{errorMsg}</div>}

        {result && (
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

                    <div className='stat-card'>
                        <div className='stat-label'>문자</div>
                        <div className='stat-value'>{result.smsCount}</div>
                    </div>
                </div>

                <button className='report-btn'>통합 제보하기</button>

            </div>
        )}
    </div>
  )
}

function formatDateTime(v) {
  if (!v) return "";
  // "2026-01-28T09:25:00" 같은 문자열 가정
  return v.replace("T", " ").slice(0, 16);
}

