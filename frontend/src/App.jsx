import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import Header from './components/Header.jsx';          //  Header import 추가
import Footer from './components/Footer.jsx';
import MainPage from './components/main/MainPage.jsx';
import Terms from './pages/terms';
import Privacy from './pages/privacy';
import LoginPage from './pages/LoginPage.jsx';         //  로그인 페이지
import SignupPage from './pages/SignupPage.jsx';       //  회원가입 페이지

import './App.css';

function App() {
  const location = useLocation();

  // 팝업창인지 확인 (window.opener가 있으면 팝업창)
  const isPopup = window.opener !== null;

  // 팝업이거나 terms/privacy일 때만 헤더/푸터 숨기기
  const hideHeaderFooter =
    isPopup ||
    location.pathname === '/terms' ||
    location.pathname === '/privacy';

  const showHeaderFooter = !hideHeaderFooter;

  return (
    <div
      className="app-container"
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: isPopup ? '100vh' : 'auto',
        minHeight: '100vh',
        backgroundColor: '#ffffff',
        overflow: 'hidden',
      }}
    >
      {/* 헤더: 팝업/약관/개인정보 페이지 제외하고 항상 표시 */}
      {showHeaderFooter && <Header />}

      {/* 메인 컨텐츠 영역 */}
      <div
        className="content-wrapper"
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          height: isPopup ? '100vh' : 'auto',
          overflow: isPopup ? 'auto' : 'visible',
        }}
      >
        <Routes>
          {/* 메인 페이지 */}
          <Route path="/" element={<MainPage />} />

          {/* 로그인 / 회원가입 */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* 이용약관 페이지 */}
          <Route path="/terms" element={<Terms />} />

          {/* 개인정보처리방침 페이지 */}
          <Route path="/privacy" element={<Privacy />} />
        </Routes>
      </div>

      {/* 푸터: 팝업/약관/개인정보 페이지 제외하고 표시 */}
      {showHeaderFooter && <Footer />}
    </div>
  );
}

export default App;
