import React from 'react'
import { useNavigate } from 'react-router-dom'

function CommunityFilters({query, onChangeQuery, onSubmitSearch, category, onChangeCategory, sort, onChangeSort}) {
//검색어 버튼 및 입력, 정렬
    
  const categories = ["전체", "공문사칭", "결제사기", "지인사칭", "보안/케어", "기타", "피싱예방","피해복구","최신수법","기관공지","자유게시판","질문 답변"];

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      onSubmitSearch();
    }
  };

  const navigate = useNavigate()

  return (
    <div className='community-filters'>
        <div className='search-row'>
            <input value={query} onChange={(e) => onChangeQuery(e.target.value)} placeholder='비슷한 사례 찾기...' className='search-input'onKeyPress={handleKeyPress}/>
            <button onClick={(onSubmitSearch)} className='search-btn'>검색</button>
        </div>

    <div className="chip-row">
        {categories.map((c) => (
          <button key={c}
            className={`chip ${category === c || (c === "전체" && category === "") ? "active" : ""}`}
            onClick={() => {
              if (c === "전체") {
                onChangeCategory("");
              } else {
                onChangeCategory(category === c ? "" : c);
              }
            }}
          >
            {c}
          </button>
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
