import api from "./axios";

// 1. 대표 이미지 업로드 (또는 교체)
export async function uploadMainImage(productId, file) {
    const formData = new FormData();
    formData.append("file", file); // @RequestParam("file")과 매칭

    try {
        const res = await api.post(`/products/${productId}/main-image`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return res.data; // { "url": "..." }
    } catch (error) {
        console.error("이미지 업로드 실패:", error);
        throw error;
    }
}

// 2. 대표 이미지 조회
export async function getMainImage(productId) {
    try {
        const res = await api.get(`/products/${productId}/main-image`);
        return res.data; // { "url": "..." }
    } catch (error) {
        console.error("이미지 조회 실패:", error);
        return { url: "" };
    }
}

// 3. 대표 이미지 삭제
export async function deleteMainImage(productId) {
    try {
        const res = await api.delete(`/products/${productId}/main-image`);
        return res.data; // { "deleted": true }
    } catch (error) {
        console.error("이미지 삭제 실패:", error);
        throw error;
    }
}

export async function getProducts(params = {}) {
    const res = await api.get('/products',{params})
    return res.data
}

//detail정보 가져오기
export async function getProductDetail(productId){
    const res = await api.get(`/products/${productId}`)
    return res.data
}