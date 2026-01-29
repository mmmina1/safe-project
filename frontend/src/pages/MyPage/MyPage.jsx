// ============================================================
// 1. 임포트 구역 (다른 파일에서 부품 가져오기)
// ============================================================
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import DiagnosisCenter from './components/DiagnosisCenter';
import Shopping from './components/Shopping';
import Settings from './components/Settings';
import './MyPage.css';

// ============================================================
// 2. 마이페이지 메인 컴포넌트
// ============================================================


const MyPage = () => {
    // [리액트 기초] useState: 화면에서 변하는 데이터를 관리하는 '상태' 변수입니다.
    // activeTab: 현재 어떤 메뉴가 선택되었는지(상태)
    // setActiveTab: 그 메뉴를 변경할 때 사용하는 함수
    const [activeTab, setActiveTab] = useState('dashboard');

    // [리액트 기초] 함수형 렌더링: 현재 상태(activeTab)에 따라 어떤 화면을 보여줄지 결정합니다.
    const renderContent = () => {
        if (activeTab === 'dashboard') {
            return <Dashboard />;
        }
        if (activeTab === 'diagnosis') {
            return <DiagnosisCenter />;
        }
        // 쇼핑과 설정은 내부적으로 또 탭이 나뉘어 있어서 시작 단어(startsWith)로 판단합니다.
        if (activeTab.startsWith('shopping')) {
            // [리액트 기초] Props 전달: <Shopping /> 부품에게 initialTab이라는 설정값을 넘겨줍니다.
            return <Shopping initialTab={activeTab === 'shopping-cart' ? 'cart' : 'orders'} />;
        }
        if (activeTab.startsWith('settings')) {
            return <Settings initialTab={activeTab === 'settings-profile' ? 'profile' : 'payment'} />;
        }
        return <Dashboard />;
    };


    // 결과물 페이지 조립
    return (
        // 부트스트랩 기본 문법
        <div className="container-fluid p-0">
            {/* 사이드바와 본문을 좌우로 나란히 세우기 위한 컨테이너 */}
            <div className="mypage-container">
                {/* 왼쪽 메뉴(사이드바) 배치: 선택된 값과 변경 함수를 넘겨줍니다. */}
                <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

                {/* 오른쪽 메인 콘텐츠 영역: 위에서 만든 renderContent()의 결과가 여기에 나타납니다. */}
                <main className="mypage-content">
                    {renderContent()}
                </main>
            </div>
        </div>
    );


};

export default MyPage;
