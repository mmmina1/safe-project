import React from 'react'
import ProductCard from './ProductCard'

function ProductList({items, loading, error}) {
  
  if(loading) {
    return(
      <div className='sp-glass sp-listBox'>
        <div className='sp-loading'>데이터를 불러오는 중입니다...</div>
      </div>
    )
  }

  if(error) {
    return(
      <div className='sp-glass sp-listBox'>
        <div className='sp-error'>에러발생 : {error}</div>
      </div>
    )
  }

  if(!items || items.length === 0){
    return(
      <div className='sp-glass sp-listBox'>
        <div className='sp-empty'>해당 조건에 맞는 서비스 상품이 없습니다.</div>
      </div>
    )
  }

  return (
    <div className='sp-listGrid'>
      {items.map((p) => (
        <ProductCard key={p.product_id || p.id} item={p}/>
      ))}
    </div>
  )
}

export default ProductList
