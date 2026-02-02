import React, { useEffect } from 'react'
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom'
import { getProductDetail } from '../../api/productAPI';

function ProductDetail() {

    const {id} = useParams();
    const navigate = useNavigate()

    const [product,setProduct] = useState(null)
    const [loading,setLoading] = useState(true)
    const [error,setError] = useState(null)

    useEffect(() => {
        let alive = true;

        const fetchProduct = async() => {
            try{
                setLoading(true);
                const data = await getProductDetail(id);
                if(!alive) return;
                setProduct(data)
            }catch(e) {
                console.error(e)
                if(!alive) return
                setError("상품 정보를 불러오지 못했습니다.")
            }finally{
                if(!alive) return;
                setLoading(false)
            }
        }
        fetchProduct()
        return() => {
            alive = false;
        }
    },[id]);

    if(loading) {
        return(
            <div className='sp-bg'>
                <div className='sp-shell'>
                    <div className='sp-detail-loading'>로딩 중...</div>
                </div>
            </div>
        )
    }

    if(error || !product){
        return(
            <div className='sp-bg'>
                <div className='sp-shell'>
                    <div className='sp-detail-error'>{error ?? "상품을 찾을 수 없습니다."}</div>
                    <button className='sp-back-btn' onClick={() => navigate(-1)}>← 뒤로</button>
                </div>
            </div>
        )
    }

    const imageStyle = product.mainImage
        ? {
        backgroundImage: `url(${product.mainImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        }
        : {
            background:
            "linear-gradient(135deg, rgba(70,90,200,0.4), rgba(180,70,140,0.3))",
        };

  return (
    <div className='sp-bg'>
        <div className='sp-shell'>
            <button className='sp-back-btn' onClick={() => navigate(-1)}>← 뒤로</button>

            <div className='sp-detail-container sp-glass'>
                <div className='sp-detail-header'>
                    <div className='sp-detail-image' style={imageStyle}>
                        <div className='sp-detail-info'>
                            <h1 className='sp-detial-title'>{product.name}</h1>

                            <div className='sp-detail-meta'>
                                <span className='sp-detail-rating'>
                                    ★ {Number(product.rating).toFixed(1)}
                                </span>

                                <span className='sp-detail-reviews'>
                                    ({product.reviewCount.toLocaleString()}명)
                                </span>
                            </div>
                            {/* 상품 설명 */}
                            <p className='sp-detail-desc'>{product.description}</p>



                        </div>

                    </div>

                </div>

            </div>
        </div>
    </div>
  )
}

export default ProductDetail
