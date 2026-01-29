import React from 'react'

function CommunityFilters({query, onChangeQuery, onSubmitSearch, category, onChangeCategory, sort, onChangeSort}) {
//검색어 버튼 및 입력, 정렬
    
  const categories = ["전체", "긴급사칭", "공문사칭", "결제사기", "검찰사기", "기타"];

  return (
    <div className='community-filters'>
        <div className='search-row'>
            <input value={query} onChange={(e) => onChangeQuery(e.target.value)} placeholder='비슷한 사례 찾기...' className='search-input'/>
            <button onClick={(onSubmitSearch)} className='search-btn'>검색</button>
        </div>

    <div className="chip-row">
        {categories.map((c) => (
          <button
            key={c} className={`chip ${category === c ? "active" : ""}`} onClick={() => onChangeCategory(category === c ? "" : c)} > {c} </button>
        ))}
      </div>

      <div className='sort-row'>
        <select value={sort} onChange={(e) => onChangeSort(e.target.value)}>
            <option value="recent">최신순</option>
            <option value="popular">인기순</option>
        </select>
      </div>
</div>
  )
}

export default CommunityFilters
