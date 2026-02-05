import React, { useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from './components/Herder.jsx';
import Footer from './components/Footer.jsx';
import { useToast, ToastContainer } from './components/Toast';
import MainPage from './components/main/MainPage.jsx';
import Terms from './pages/terms';
import Privacy from './pages/privacy';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import Chatbot from './pages/AiService/Chatbot/Chatbot';
import Diagnosis from './pages/AiService/Diagnosis/Diagnosis';
import CommunityList from './components/community/CommunityList';
import OperatorLayout from './pages/operator/OperatorLayout.jsx';
import OperatorDashboard from './pages/operator/OperatorDashboard.jsx';
import UserSearchPage from './pages/operator/UserSearchPage.jsx';
import CsDashboardPage from './pages/operator/CsDashboardPage.jsx';
import ServiceProductsPage from './pages/operator/ServiceProductsPage.jsx';
import CommunityReportsPage from './pages/operator/CommunityReportsPage.jsx';
import BlindReasonsPage from './pages/operator/BlindReasonsPage.jsx';
import NoticesPage from './pages/operator/NoticesPage.jsx';
import BannersPage from './pages/operator/BannersPage.jsx';
import BlacklistPage from './pages/operator/BlacklistPage.jsx';
import './App.css';

// Toast Context 생성
export const ToastContext = React.createContext(null);

function App() {
  const location = useLocation();
  const toast = useToast();
  
  // 팝업창인지 확인 (window.opener가 있으면 팝업창)
  const isPopup = window.opener !== null;
  
  // 팝업창이거나 terms/privacy 페이지면 헤더와 푸터 숨김
  const hideHeaderFooter = isPopup || location.pathname === '/terms' || location.pathname === '/privacy';
  const showHeaderFooter = !hideHeaderFooter;

  return (
    <ToastContext.Provider value={toast}>
      <div 
        className="app-container"
        style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          height: isPopup ? '100vh' : 'auto',
          minHeight: '100vh',
          backgroundColor: '#ffffff',
          overflow: 'visible'
        }}
      >
        {/* 헤더 표시 (terms/privacy 제외) */}
        {showHeaderFooter && <Header />}
        
        {/* 토스트 컨테이너 */}
        {showHeaderFooter && <ToastContainer toasts={toast.toasts} onRemove={toast.removeToast} />}
        
        {/* 메인 컨텐츠 영역 */}
        <div 
          className="content-wrapper"
          style={{ 
            flex: 1, 
            display: 'flex', 
            flexDirection: 'column',
            width: '100%',
            paddingTop: showHeaderFooter ? '100px' : '0'
          }}
        >
        <Routes>
          {/* 메인 페이지 */}
          <Route path="/" element={<MainPage />} />
          
          {/* 인증 페이지 */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          
          {/* AI 서비스 페이지 */}
          <Route path="/ai" element={<Chatbot />} />
          <Route path="/ai/chatbot" element={<Chatbot />} />
          <Route path="/ai/diagnosis" element={<Diagnosis />} />
          
          {/* 커뮤니티 페이지 */}
          <Route path="/community" element={<CommunityList />} />
          
          {/* 관제 페이지 (임시로 메인 페이지로) */}
          <Route path="/monitoring" element={<MainPage />} />
          
          {/* 서비스 페이지 (임시로 메인 페이지로) */}
          <Route path="/service" element={<MainPage />} />
          
          {/* 이용약관 페이지 */}
          <Route path="/terms" element={<Terms />} />
          
          {/* 개인정보처리방침 페이지 */}
          <Route path="/privacy" element={<Privacy />} />
          
          {/* 운영자 페이지 */}
          <Route path="/operator" element={<OperatorLayout />}>
            <Route index element={<OperatorDashboard />} />
            <Route path="users" element={<UserSearchPage />} />
            <Route path="cs" element={<CsDashboardPage />} />
            <Route path="products" element={<ServiceProductsPage />} />
            <Route path="community-reports" element={<CommunityReportsPage />} />
            <Route path="blind-reasons" element={<BlindReasonsPage />} />
            <Route path="notices" element={<NoticesPage />} />
            <Route path="banners" element={<BannersPage />} />
            <Route path="blacklist" element={<BlacklistPage />} />
          </Route>
        </Routes>
      </div>

        {/* 푸터는 메인 페이지에서만 표시 */}
        {showHeaderFooter && <Footer />}
      </div>
    </ToastContext.Provider>
  );
}

export default App;
