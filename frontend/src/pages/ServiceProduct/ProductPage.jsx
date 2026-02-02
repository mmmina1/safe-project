import React, { useEffect, useMemo, useState } from 'react'
import { getProducts } from '../../api/productAPI'
import ProductFilters from '../../components/serviceProduct/ProductFilters'
import ProductList from '../../components/serviceProduct/ProductList'
import '../../assets/css/ServiceProduct/ProductPage.css'

function ProductPage() {

    const [items,setItems] = useState([])
    const [pageInfo,setPageInfo] = useState({page:0, size:12, totalPages:0, totalElements:0})

    const [filters, setFilters] = useState({
        q: "",
        category: "ALL",
        sort: "POPULAR"
    })

    const [loading, setLoading] = useState(false)
    const [error,setError] = useState("")

    const params = useMemo(() => ({
        q: filters.q || undefined,
        category: filters.category !== "ALL" ? filters.category : undefined,
        sort : filters.sort || undefined,
        page : pageInfo.page,
        size : pageInfo.size,
    }), [filters,pageInfo.page,pageInfo.size])

    useEffect(() => {
        let alive = true;

        const run = async() => {
            setLoading(true)
            setError("")

            try{
                const data = await getProducts(params)

                const list = Array.isArray(data) ? data : (data?.content ?? data?.items ?? []);
                const totalPages = data?.totalPages ?? 0;
                const totalElements = data?.totalElements ?? list.length;

                if (!alive) return;
                setItems(list);
                setPageInfo((prev) => ({ ...prev, totalPages, totalElements }));
            } catch (e) {
                if (!alive) return;
                setError("상품 목록을 불러오지 못했습니다.");
            } finally {
                if (alive) setLoading(false);
            }
        };
        run()
        return() => {alive = false}
    },[params])

    const handleChangeFilters = (next) => {
        setFilters((prev) => ({...prev, ...next}))
        setPageInfo((prev) => ({...prev, page:0}))
    }

  return (
    <div className='sp-bg'>
        <div className='sp-shell'>
            <header className='sp-top'>
                <div className='sp-title'>[RISK WATCH] 서비스 상품</div>
                <div className='sp-sub'>실시간 혜택과 추천 상품을 확인해보세요.</div>
            </header>

            <div className='sp-grid'>
                <aside className='sp-leftPanel'>
                    <ProductFilters value={filters} onChange={handleChangeFilters}/>
                </aside>

                <main className='sp-rightPanel'>
                    <ProductList items={items} loading={loading} error={error}/>
                    
                    <div className='sp-pager'>
                        <button className='sp-pagerBtn' disabled={pageInfo.page <=0 || loading} onClick={() => setPageInfo((p) => ({...p, page:Math.max(0, p.page-1)}))}>이전</button>

                        <div className='sp-pagerInfo'>
                            {pageInfo.page +1}
                            {pageInfo.totalPages ? `/ ${pageInfo.totalPages}` : ""}
                        </div>

                        <button
                            className="sp-pagerBtn"
                            disabled={(pageInfo.totalPages ? pageInfo.page >= pageInfo.totalPages - 1 : items.length < pageInfo.size) || loading}
                            onClick={() => setPageInfo((p) => ({ ...p, page: p.page + 1 }))}>다음</button>
                    </div>
                </main>
            </div>
        </div>
    </div>
  )
}

export default ProductPage
