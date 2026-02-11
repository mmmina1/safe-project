import api from "./axiosInstance";

//목록 조회
export const getProductQna = async(productId, {page=0,size=0} = {}) => {
    const res = await api.get(`/api/products/${productId}/qna`,{
        params : {page,size,sort:"qnaId,desc"},
    })
    return res.data;
}

// 문의 등록
export const createProductQna = async (productId, payload) => {
  const res = await api.post(`/api/products/${productId}/qna`, payload);
  return res.data; // ProductQnaResponse
};