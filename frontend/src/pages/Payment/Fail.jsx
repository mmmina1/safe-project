import { useSearchParams, useNavigate } from "react-router-dom";

export default function Fail() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const errorCode = searchParams.get("code");
    const errorMessage = searchParams.get("message");

    return (
        <div className="container py-5 text-center">
            <div className="card shadow-sm p-5 border-danger">
                <h2 className="text-danger mb-4">❌ 결제를 실패했어요</h2>
                <div className="bg-light p-3 rounded mb-4 text-start">
                    <div><strong>에러 코드:</strong> {errorCode}</div>
                    <div><strong>메시지:</strong> {errorMessage}</div>
                </div>
                <div className="d-flex justify-content-center gap-2">
                    <button className="btn btn-outline-secondary" onClick={() => navigate("/")}>
                        홈으로
                    </button>
                    <button className="btn btn-primary" onClick={() => navigate("/payment")}>
                        다시 결제하기
                    </button>
                </div>
            </div>
        </div>
    );
}
