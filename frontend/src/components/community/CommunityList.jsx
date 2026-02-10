import React, { useEffect } from 'react'
import { useMemo, useState } from 'react'
import "../../assets/css/community/Community.css"
import { useNavigate } from 'react-router-dom'
import { communityApi } from '../../api/communityApi'
import CommunityFilters from './CommunityFilters'
import CommunityCard from './CommunityCard'

function CommunityList() {//목록

  const navigate = useNavigate()

  const [query,setQuery] = useState("")
  const [category,setCategory] = useState("")
  const [sort,setSort] = useState("recent")

  const [page,setPage] = useState(1)
  const [size] = useState(10)

  const [items,setItems] = useState([])
  const [total,setTotal] = useState(0)
  const [loading,setLoading] = useState(false)
  
  //db에 저장된 게시글 데이터 백업
  const fetchPosts = async (nextPage = page) => {
  setLoading(true);
  try {
    const data = await communityApi.getPosts({ query, category, sort, page: nextPage, size });
    setItems(data.items || []);
    setTotal(data.total || 0);
    setPage(data.page || nextPage);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchPosts(1)//필터변경 시 1페이지부터
  },[category,sort])

  const onSubmitSearch = () => fetchPosts(1)

  return (
    <div className='community-page'>
      <div className='community-header'>
        <h1>스미싱 피해 사례</h1>
      </div>
    
    <CommunityFilters query={query} onChangeQuery={setQuery} category={category} onChangeCategory={setCategory}
  sort={sort} onChangeSort={setSort} onSubmitSearch={onSubmitSearch} />

    <div className='section-title'>최근 스미싱 피해 사례</div>

    <div className='post-list'>
      {loading && <div className='loading'>불러오는 중...</div>}
      {!loading && items.length === 0 && <div className='empty'>게시글이 없습니다.</div>}
      {items.map((p) => <CommunityCard key={p.post_id ?? p.postId} post={p}/>)}
    </div>

    <div className='list-footer'>
      <button className='write-btn' onClick={() => navigate("/community/new")}>작성</button>
    

    <div className='pager'>
      <button disabled={page<=1} onClick={() => fetchPosts(page-1)}>이전</button>
      <span>{page}</span>
      <button disabled={page * size >= total} onClick={() => fetchPosts(page+1)}>다음</button>
    </div>
  </div>
</div>
  )
}

export default CommunityList
