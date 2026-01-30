import axios from "axios"

export async function getProducts(params = {}) {
    const res = await axios.get('/api/products',{params})
    return res.data
}