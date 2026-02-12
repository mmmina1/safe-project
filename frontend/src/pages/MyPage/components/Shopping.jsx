import React, { useState } from 'react';
import { Package, ShoppingBag, Trash2, ChevronRight, CreditCard } from 'lucide-react';
import { getMyCart, deleteCartItem, updateCartItem, checkout, getMyOrders } from '../../../api/cartApi';

const Shopping = ({ initialTab = 'orders' }) => {
    const [activeTab, setActiveTab] = useState(initialTab);
    const [cartItems, setCartItems] = useState([]);
    const [orders, setOrders] = useState([]); // [New] 진짜 주문 내역 데이터
    const [loading, setLoading] = useState(false);

    React.useEffect(() => {
        setActiveTab(initialTab);
    }, [initialTab]);

    // 데이터 통합 조회 (주문내역 & 장바구니)
    const fetchData = async () => {
        try {
            setLoading(true);
            // 1. 장바구니 조회
            const cartData = await getMyCart();
            setCartItems(cartData);

            // 2. 주문 내역 조회
            const orderData = await getMyOrders();
            // 백엔드 형식을 프론트엔드 형식으로 변환
            const formattedOrders = orderData.map(order => ({
                id: order.orderId.toString(),
                date: new Date(order.orderDate).toLocaleDateString(),
                items: order.items.length > 1
                    ? `${order.items[0].productName} 외 ${order.items.length - 1}건`
                    : order.items[0].productName,
                price: order.totalPrice.toLocaleString(),
                status: order.status === 'PAYMENT_COMPLETED' ? '결제완료' : order.status
            }));
            setOrders(formattedOrders);
        } catch (error) {
            console.error('데이터 로딩 실패:', error);
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        fetchData();
    }, [activeTab]);

    // Read
    // 장바구니 목록 조회
    const fetchCart = async () => {
        try {
            const data = await getMyCart();
            setCartItems(data);
        } catch (error) {
            console.error(error);
        }
    };

    // Update
    // 장바구니 수량 변경
    const handleQuantityChange = async (cartId, currentQuantity, change) => {
        const newQuantity = currentQuantity + change;
        if (newQuantity < 1) return;
        try {
            await updateCartItem(cartId, newQuantity);
            setCartItems(prev => prev.map(item =>
                item.cartId === cartId ? { ...item, quantity: newQuantity } : item
            ));
        } catch (error) {
            alert('수량 변경에 실패했습니다.');
        }
    };

    // Delete
    // 장바구니 삭제
    const handleDelete = async (cartId) => {
        if (!window.confirm('정말 삭제하시겠습니까?')) return;
        try {
            await deleteCartItem(cartId);
            setCartItems(prev => prev.filter(item => item.cartId !== cartId));
        } catch (error) {
            console.error(error);
            alert('삭제 실패했습니다.');
        }
    };

    // 주문 취소 핸들러 (준비중)
    const handleCancelOrder = (orderId) => {
        alert('주문 취소 기능은 준비 중입니다.');
    };

    // 주문 상세 보기 핸들러
    const handleViewOrderDetail = (orderId) => {
        alert(`주문 번호 ${orderId} 상세 내역 (구현 예정)`);
    };

    const calculateTotal = () => {
        return cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    };

    // [New] 진짜 주문하기 핸들러
    const handleCheckout = async () => {
        if (cartItems.length === 0) {
            alert('장바구니가 비어있습니다.');
            return;
        }

        const totalValue = calculateTotal();
        const confirmCheckout = window.confirm(`총 ${cartItems.length}개 상품을 주문하시겠습니까?\n합계: ${totalValue.toLocaleString()}원`);
        if (confirmCheckout) {
            try {
                await checkout();
                alert('결제가 완료되었습니다!');
                fetchData(); // 데이터 새로고침
                setActiveTab('orders'); // 주문내역 탭으로 이동
            } catch (error) {
                alert('주문 처리 중 오류가 발생했습니다.');
            }
        }
    };

    return (
        <div className="animate-fade-in">
            <h2 className="page-title">쇼핑 내역</h2>

            {/* 소메뉴 탭 (주문내역 vs 장바구니) */}
            <div className="nav nav-pills mb-4 p-2 rounded-3 shadow-none d-inline-flex border border-secondary">
                <button
                    className={`nav-link px-4 ${activeTab === 'orders' ? 'active' : 'text-white'}`}
                    onClick={() => setActiveTab('orders')}
                >
                    주문내역조회
                </button>
                <button
                    className={`nav-link px-4 ${activeTab === 'cart' ? 'active' : 'text-white'}`}
                    onClick={() => setActiveTab('cart')}
                >
                    장바구니 ({cartItems.length})
                </button>
            </div>

            {/* --- CASE A: 주문 내역 리스트 --- */}
            {activeTab === 'orders' && (
                <div className="animate-fade-in">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h5 className="card-label mb-0 text-white">최근 3개월 주문 내역</h5>
                        <select className="form-select form-select-sm w-auto bg-transparent border-secondary text-white">
                            <option className="bg-dark">최근 3개월</option>
                            <option className="bg-dark">2023년 전체</option>
                        </select>
                    </div>

                    {/* 데이터 배열을 돌며 주문 카드들을 만듭니다. */}
                    {orders.length === 0 ? (
                        <div className="text-center py-5 text-secondary">주문 내역이 없습니다.</div>
                    ) : (
                        orders.map((order) => (
                            <div key={order.id} className="dashboard-card p-4 mb-3">
                                <div className="d-flex justify-content-between align-items-start mb-3 border-bottom pb-2">
                                    <div>
                                        <span className="text-secondary small me-3">{order.date} 주문</span>
                                        <span className="text-secondary small">주문번호 {order.id}</span>
                                    </div>
                                    <button
                                        className="btn btn-link btn-sm p-0 text-decoration-none text-secondary"
                                        onClick={() => handleViewOrderDetail(order.id)}
                                    >
                                        주문상세보기 &gt;
                                    </button>
                                </div>
                                <div className="d-flex align-items-center">
                                    <div className="bg-dark rounded p-3 me-4 border border-secondary">
                                        <Package size={32} className="text-secondary" />
                                    </div>
                                    <div className="flex-grow-1">
                                        <h6 className="mb-1 text-white">{order.items}</h6>
                                        <div className="d-flex align-items-center">
                                            <span className="fw-bold me-3 text-white">{order.price}원</span>
                                            <span className={`status-badge ${order.status === '주문취소' ? 'bg-secondary text-white' : 'badge-safe'}`}>{order.status}</span>
                                        </div>
                                    </div>
                                    {/* 상태에 따라 다른 기능을 하는 버튼 표시 */}
                                    {order.status === '결제완료' && (
                                        <button
                                            className="btn btn-outline-danger btn-sm"
                                            onClick={() => handleCancelOrder(order.id)}
                                        >
                                            주문취소
                                        </button>
                                    )}
                                    {order.status === '배송완료' && (
                                        <div className="d-flex gap-2">
                                            <button className="btn btn-outline-secondary btn-sm">반품신청</button>
                                            <button className="btn btn-primary btn-sm">리뷰작성</button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {/* --- CASE B: 장바구니 리스트 --- */}
            {activeTab === 'cart' && (
                <div className="animate-fade-in">
                    <div className="dashboard-card p-0 overflow-hidden">
                        <div className="p-4 border-bottom border-secondary bg-transparent">
                            <div className="form-check">
                                <input className="form-check-input bg-transparent border-secondary" type="checkbox" defaultChecked readOnly />
                                <label className="form-check-label fw-bold text-white">전체 선택</label>
                            </div>
                        </div>
                        {/* 장바구니에 담긴 아이템들을 보여줍니다. */}
                        {cartItems.map((item) => (
                            <div key={item.cartId} className="p-4 border-bottom border-secondary d-flex align-items-center">
                                <input className="form-check-input me-4 bg-transparent border-secondary" type="checkbox" defaultChecked readOnly />
                                <div className="bg-dark rounded p-3 me-4 text-center border border-secondary" style={{ width: '80px' }}>
                                    <ShoppingBag size={32} className="text-secondary" />
                                </div>
                                <div className="flex-grow-1">
                                    <h6 className="mb-1 text-white">{item.productName}</h6>
                                    <div className="fw-bold text-white">{item.price ? item.price.toLocaleString() : 0}원</div>
                                </div>
                                <div className="d-flex align-items-center border border-secondary rounded overflow-hidden me-4">
                                    <button
                                        className="btn btn-sm bg-transparent border-0 px-2 text-white"
                                        onClick={() => handleQuantityChange(item.cartId, item.quantity, -1)}
                                    >
                                        -
                                    </button>
                                    <span className="px-3 text-white">{item.quantity}</span>
                                    <button
                                        className="btn btn-sm bg-transparent border-0 px-2 text-white"
                                        onClick={() => handleQuantityChange(item.cartId, item.quantity, 1)}
                                    >
                                        +
                                    </button>
                                </div>
                                <button
                                    className="btn btn-link text-danger p-0"
                                    onClick={() => handleDelete(item.cartId)}
                                >
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        ))}
                        {/* 합계 및 주문하기 하단 바 */}
                        <div className="p-4 bg-transparent border-top border-secondary text-end">
                            <div className="mb-3">
                                <span className="text-secondary me-3">총 상품금액</span>
                                <span className="fw-bold fs-5 text-white">{calculateTotal().toLocaleString()}원</span>
                            </div>
                            <button
                                className="btn btn-primary btn-lg px-5"
                                onClick={handleCheckout}
                            >
                                주문하기
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Shopping;
