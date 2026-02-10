import { useEffect, useRef, useState } from "react";
import { loadTossPayments, ANONYMOUS } from "@tosspayments/tosspayments-sdk";

// 토스 샌드박스에서 제공하는 공식 테스트 키
const clientKey = "test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm";

export default function PaymentPractice() {
    const [widgets, setWidgets] = useState(null);
    const [amount, setAmount] = useState({
        currency: "KRW",
        value: 15000,
    });
    const paymentMethodWidgetRef = useRef(null);

    // 1. SDK 초기화
    useEffect(() => {
        async function fetchPaymentWidgets() {
            const tossPayments = await loadTossPayments(clientKey);
            const widgets = tossPayments.widgets({ customerKey: ANONYMOUS });
            setWidgets(widgets);
        }
        fetchPaymentWidgets();
    }, []);

    // 2. 결제 위젯 렌더링
    useEffect(() => {
        async function renderPaymentWidgets() {
            if (widgets == null) return;

            await widgets.setAmount(amount);

            const [paymentMethodWidget] = await Promise.all([
                widgets.renderPaymentMethods({
                    selector: "#payment-method",
                    variantKey: "DEFAULT",
                }),
                widgets.renderAgreement({
                    selector: "#agreement",
                    variantKey: "AGREEMENT",
                }),
            ]);

            paymentMethodWidgetRef.current = paymentMethodWidget;
        }
        renderPaymentWidgets();
    }, [widgets]);

    const handlePaymentRequest = async () => {
        try {
            await widgets?.requestPayment({
                orderId: window.btoa(Math.random()).slice(0, 20),
                orderName: "토스페이 결제 연습",
                customerName: "연습생",
                customerEmail: "test@example.com",
                successUrl: window.location.origin + "/payment/success",
                failUrl: window.location.origin + "/payment/fail"
            });
        } catch (error) {
            console.error("결제 중 오류 발생:", error);
        }
    };

    return (
        <div className="animate-fade-in">
            <h2 className="page-title">💳 결제 연습 (Sandbox)</h2>
            <p className="text-secondary mb-4">토스페이먼츠의 실제 결제 흐름을 안전하게 연습해볼 수 있습니다.</p>

            <div className="dashboard-card">
                <div id="payment-method" className="w-100" />
                <div id="agreement" className="w-100" />

                <div className="mt-4 text-center border-top border-secondary pt-4">
                    <p className="text-secondary small mb-3">연습용이므로 실제 비용이 청구되지 않습니다.</p>
                    <button
                        className="btn btn-primary btn-lg px-5 py-3 fw-bold"
                        onClick={handlePaymentRequest}
                    >
                        {amount.value.toLocaleString()}원 테스트 결제하기
                    </button>
                </div>
            </div>
        </div>
    );
}
