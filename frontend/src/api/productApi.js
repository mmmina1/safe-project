import axios from "axios"

export async function getProducts(params = {}) {
    const res = await axios.get('/api/products',{params})
    return res.data
}

//detail정보 가져오기
export async function getProductDetail(productId){
    const res = await axios.get(`/api/products/${productId}`)
    return res.data
}