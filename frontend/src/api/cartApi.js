import axiosInstance from './axiosInstance';


/**
 * 장바구니 담기
 * Create
 * POST /api/cart
 * @param {object} data { productId, planId, quantity }
*/
export const addToCart = async (data) => {
    const token = localStorage.getItem('accessToken');
    try {
        const response = await axiosInstance.post('/api/cart', data, {
            headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        return response.data;
    } catch (error) {
        console.error('장바구니 담기 실패:', error);
        throw error;
    }
};

/**
 * 장바구니 목록 조회
 * Read
 * GET /api/cart
 */
export const getMyCart = async () => {
    const token = localStorage.getItem('accessToken');
    try {
        const response = await axiosInstance.get('/api/cart', {
            headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        return response.data;
    } catch (error) {
        console.error('장바구니 조회 실패:', error);
        throw error;
    }
};

/**
 * 장바구니 수정
 * Update
 * PUT /api/cart/:cartId
 * @param {object} data { quantity }
 */
export const updateCartItem = async (cartId, quantity) => {
    const token = localStorage.getItem('accessToken');
    try {
        const response = await axiosInstance.put(`/api/cart/${cartId}`, { quantity }, {
            headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        return response.data;
    } catch (error) {
        console.error('장바구니 수정 실패:', error);
        throw error;
    }
};

/**
 * 장바구니 삭제
 * Delete
 * DELETE /api/cart/:cartId
 */
export const deleteCartItem = async (cartId) => {
    const token = localStorage.getItem('accessToken');
    try {
        const response = await axiosInstance.delete(`/api/cart/${cartId}`, {
            headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        return response.data;
    } catch (error) {
        console.error('장바구니 삭제 실패:', error);
        throw error;
    }
};
