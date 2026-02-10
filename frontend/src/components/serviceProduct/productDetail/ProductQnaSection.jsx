import React, { useEffect, useState } from 'react'
import '../../../assets/css/ServiceProduct/ProductQna.css'

function ProductQnaSection({productId}) {

  const [loading, setLoading] = useState(true)
  const [items, setItems] = useState([])
  const [err, setErr] = useState(null)
  
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({title:'', content:'', isPrivate: false})

  useEffect(() => {
    let alive = true

    const fetchQna = async() => {
      try{
        setLoading(true)
        setErr(null)

        if(!alive) return
        setItems([])
      }catch(e) {
        console.error(e)
        if(!alive) return
        setErr('문의 정보를 불러오지 못했습니다.')
      }finally{
        if(!alive) return
        setLoading(false)
      }
    }
    fetchQna()
    return() => {alive = false}
  },[productId])

  const onSubmit = async(e) => {
    e.preventDefault()
    if(!form.title.trim() || !form.content.trim()){
      alert('제목과 내용을 입력해주세요.')
      return
    }

    try{
      alert('문의가 등록되었습니다.')
      setForm({title:'', content:'', isPrivate: false})
      setShowForm(false)
    }catch(e) {
      alert('문의 등록 실패')
    }
  }

  if(loading) return <div className='sp-qna'>로딩 중...</div>
  if(err) return <div className='sp-qna sp-qna-error'>{err}</div>

  return (
    <div className='sp-qna'>
      <div className='sp-qna-header'>
        <div className='sp-qna-title'>상품 문의</div>
        <button className='sp-qna-writerBtn' onClick={() => setShowForm(v => !v)}>
          {showForm ? '작성 닫기' : '문의 작성'}
        </button>
      </div>

      {showForm && (
        <form className='sp-qna-form' onSubmit={onSubmit}>
          <input className='sp-qna-input' placeholder='문의 제목' value={form.title} onChange={(e) => setForm(prev => ({...prev, title:e.target.value}))}/>

          <textarea className='sp-qna-textarea' placeholder='문의 내용' value={form.content} onChange={(e) => setForm(prev => ({...prev, content: e.target.value}))}/>

            <label className='sp-qna-private'>
              <input type='checkbox' checked={form.isPrivate} onChange={(e) => setForm(prev => ({ ...prev, isPrivate: e.target.checked }))}/> 비밀글 </label>

            <button className='sp-qna-submit' type='submit'>등록</button>
        </form>
      )}

      {items.length === 0? (
        <div className='sp-qna-empty'>등록된 문의가 없습니다.</div>
      ):(
        <div className='sp-qna-list'>
          {items.map((qna) => (
            <div key={qna.qnaId} className='sp-qna-item'>
              <div className='sp-qna-itemTitle'>{qna.title}</div>
              <div className='sp-qna-itemMeta'>
                <span>{qna.status ?? 'WAITING'}</span>
                <span className='sp-dot'>/</span>
                <span>{qna.answerdAt ? '답변완료' : '대기중'}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ProductQnaSection
