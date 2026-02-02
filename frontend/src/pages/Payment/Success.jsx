import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Success() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [isConfirmed, setIsConfirmed] = useState(false);

    const paymentKey = searchParams.get("paymentKey");
    const orderId = searchParams.get("orderId");
    const amount = searchParams.get("amount");

    useEffect(() => {
        // 성공 페이지 진입 시 자동으로 백엔드 승인 요청
        const confirmPayment = async () => {
            try {
                const response = await axios.post("/api/v1/payments/confirm", {
                    paymentKey,
                    orderId,
                    amount,
                });

                if (response.status === 200) {
                    setIsConfirmed(true);
                }
            } catch (error) {
                console.error("결제 승인 중 오류 발생:", error);
            }
        };

        if (paymentKey && orderId && amount) {
            confirmPayment();
        }
    }, [paymentKey, orderId, amount]);

    return (
        <div className="container py-5 text-center">
            {isConfirmed ? (
                <div className="card shadow-sm p-5 border-success">
                    <h2 className="text-success mb-4">✅ 결제를 완료했어요</h2>
                    <div className="bg-light p-3 rounded mb-4 text-start">
                        <div><strong>금액:</strong> {Number(amount).toLocaleString()}원</div>
                        <div><strong>주문번호:</strong> {orderId}</div>
                    </div>
                    <button className="btn btn-success" onClick={() => navigate("/")}>
                        홈으로 돌아가기
                    </button>
                </div>
            ) : (
                <div>
                    <div className="spinner-border text-primary mb-3" role="status" />
                    <h3>결제 승인을 확인하고 있습니다...</h3>
                </div>
            )}
        </div>
    );
}
