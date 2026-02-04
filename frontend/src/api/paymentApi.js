import axios from "axios";

/**
 * 토스페이먼츠 결제 승인 요청
 * @param {Object} paymentData - paymentKey, orderId, amount 포함
 * @returns {Promise} Axios Response
 */
export const confirmPayment = async (paymentData) => {
    try {
        const response = await axios.post("/api/v1/payments/confirm", paymentData);
        return response;
    } catch (error) {
        console.error("Payment Confirmation API Error:", error);
        throw error;
    }
};
