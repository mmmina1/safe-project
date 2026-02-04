// ============================================================
// 1. 임포트 구역 (아이콘 및 라이브러리)
// ============================================================
import React from 'react';
import {
    LayoutDashboard,
    Search,
    ShoppingBag,
    ShoppingCart,
    CreditCard,
    UserCircle,
    Settings as SettingsIcon
} from 'lucide-react'; // 깔끔한 디자인의 아이콘들을 가져옵니다.

// ============================================================
// 2. 사이드바 컴포넌트 (부품)
// ============================================================
// [리액트 기초] Props: 부모(MyPage)가 전달해준 데이터(activeTab, onTabChange)를 받아 사용합니다.
const Sidebar = ({ activeTab, onTabChange }) => {
    // 메뉴 구성을 배열(Array) 형태로 관리하면 수정이나 추가가 매우 쉽습니다.
    const menuConfig = [
        { id: 'dashboard', label: '대시보드 홈', icon: <LayoutDashboard size={20} /> },
        { category: '진단 센터' }, // 제목만 있는 줄
        { id: 'diagnosis', label: '진단 이력', icon: <Search size={20} /> },
        { category: '쇼핑/결제' },
        { id: 'shopping-orders', label: '주문내역조회', icon: <ShoppingBag size={20} /> },
        { id: 'shopping-cart', label: '장바구니', icon: <ShoppingCart size={20} /> },
        { category: '설정' },
        { id: 'settings-payment', label: '결제수단 관리', icon: <CreditCard size={20} /> },
        { id: 'settings-profile', label: '프로필 관리', icon: <UserCircle size={20} /> },
        { id: 'payment-practice', label: '결제 연습', icon: <CreditCard size={20} /> },
    ];

    return (
        <aside className="mypage-sidebar">
            <nav className="sidebar-menu">
                {/* [리액트 기초] .map(): 배열 안에 있는 데이터들을 하나씩 꺼내서 반복적으로 HTML 요소를 만듭니다. */}
                {menuConfig.map((item, idx) => (
                    item.category ? (
                        // 카테고리 제목 레이블인 경우
                        <div key={`cat-${idx}`} className="sidebar-category">{item.category}</div>
                    ) : (
                        // 실제 클릭 가능한 메뉴 버튼인 경우
                        <button
                            key={item.id}
                            // [리액트 기초] 조건부 클래스: 현재 선택된 메뉴와 버튼의 id가 같으면 'active' 스타일을 줍니다.
                            className={`sidebar-item w-100 border-0 ${activeTab === item.id ? 'active' : ''}`}
                            // 버튼을 클릭하면 부모로부터 받은 함수를 실행하여 전체 화면의 탭을 바꿉니다.
                            onClick={() => onTabChange(item.id)}
                        >
                            {item.icon}
                            <span className="sidebar-item-label">{item.label}</span>
                        </button>
                    )
                ))}
            </nav>
        </aside>
    );
};

export default Sidebar;
