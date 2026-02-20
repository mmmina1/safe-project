// src/api/paymentApi.js
import axiosInstance from "./axiosInstance"; // axios 대신 공용 도구 사용

/**
 * 토스페이먼츠 결제 승인 요청
 * @param {Object} paymentData - paymentKey, orderId, amount 포함
 * @returns {Promise} Axios Response
 */
export const confirmPayment = async (paymentData) => {
    try {
        const response = await axiosInstance.post("/v1/payments/confirm", paymentData);
        return response;
    } catch (error) {
        console.error("Payment Confirmation API Error:", error);
        throw error;
    }
};
