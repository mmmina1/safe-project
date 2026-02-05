import axiosInstance from './axiosInstance';

/**
 * 장바구니 목록 조회
 * GET /api/cart
 */
export const getMyCart = async () => {
    try {
        const response = await axiosInstance.get('/api/cart');
        return response.data;
    } catch (error) {
        console.error('장바구니 조회 실패:', error);
        throw error;
    }
};

/**
 * 장바구니 담기
 * POST /api/cart
 * @param {object} data { productId, planId, quantity }
 */
export const addToCart = async (data) => {
    try {
        const response = await axiosInstance.post('/api/cart', data);
        return response.data;
    } catch (error) {
        console.error('장바구니 담기 실패:', error);
        throw error;
    }
};

/**
 * 장바구니 삭제
 * DELETE /api/cart/:cartId
 */
export const deleteCartItem = async (cartId) => {
    try {
        const response = await axiosInstance.delete(`/api/cart/${cartId}`);
        return response.data;
    } catch (error) {
        console.error('장바구니 삭제 실패:', error);
        throw error;
    }
};
