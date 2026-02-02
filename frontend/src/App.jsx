import React from 'react';
<<<<<<< HEAD
import { Routes, Route, useLocation } from 'react-router-dom';
=======
import { Routes, Route, useLocation, Link } from 'react-router-dom';
>>>>>>> b0ab98293bedc6ec51b2aff874dc0d691bf6e534
import 'bootstrap/dist/css/bootstrap.min.css';

import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import MainPage from './components/main/MainPage.jsx';
import Terms from './pages/terms';
import Privacy from './pages/privacy';
import LoginPage from './pages/LoginPage.jsx';
import SignupPage from './pages/SignupPage.jsx';
import KakaoCallbackPage from './pages/KakaoCallbackPage.jsx';  //  추가
import GoogleCallbackPage from './pages/GoogleCallbackPage.jsx';
<<<<<<< HEAD

import './App.css';
=======
import AdminLayout from './layouts/AdminLayout.jsx';
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import UserManagement from './pages/admin/UserManagement.jsx';
import DataPolicy from './pages/admin/DataPolicy.jsx';

import './App.css';
import Chatbot from './pages/AiService/Chatbot/Chatbot';
import Diagnosis from './pages/AiService/Diagnosis/Diagnosis';
import Simulator from './pages/AiService/Simulator/Simulator';
import MyPage from './pages/MyPage/MyPage.jsx';
>>>>>>> b0ab98293bedc6ec51b2aff874dc0d691bf6e534

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

<<<<<<< HEAD
=======
      {/* ⚠️ AI 서비스 임시 네비게이션 (개발용) */}
      {showHeaderFooter && (
        <nav className="p-2 bg-light border-bottom text-center">
          <Link to="/chatbot" className="me-3 text-decoration-none">🤖 챗봇</Link>
          <Link to="/diagnosis" className="me-3 text-decoration-none">🛡️ 진단</Link>
          <Link to="/simulator" className="me-3 text-decoration-none">🎮 훈련</Link>
          <Link to="/mypage" className="text-decoration-none">👤 마이페이지</Link>
        </nav>
      )}

>>>>>>> b0ab98293bedc6ec51b2aff874dc0d691bf6e534
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

          {/*  카카오 로그인 콜백 */}
          <Route path="/oauth/callback/kakao" element={<KakaoCallbackPage />} />
<<<<<<< HEAD
          
          {/*  구글 로그인 콜백 */}
          <Route path="/oauth/callback/google" element={<GoogleCallbackPage />} />
          
=======

          {/*  구글 로그인 콜백 */}
          <Route path="/oauth/callback/google" element={<GoogleCallbackPage />} />

>>>>>>> b0ab98293bedc6ec51b2aff874dc0d691bf6e534
          {/* 이용약관 페이지 */}
          <Route path="/terms" element={<Terms />} />

          {/* 개인정보처리방침 페이지 */}
          <Route path="/privacy" element={<Privacy />} />

          {/* 관리자 영역 */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="manage" element={<UserManagement />} />
            <Route path="policy" element={<DataPolicy />} />
          </Route>
<<<<<<< HEAD
=======

          {/* AI 서비스 추가 */}
          <Route path="/chatbot" element={<Chatbot />} />
          <Route path="/diagnosis" element={<Diagnosis />} />
          <Route path="/simulator" element={<Simulator />} />
          <Route path="/mypage" element={<MyPage />} />
>>>>>>> b0ab98293bedc6ec51b2aff874dc0d691bf6e534
        </Routes>
      </div>

      {/* 푸터: 팝업/약관/개인정보 페이지 제외하고 표시 */}
      {showHeaderFooter && <Footer />}
    </div>
  );
}

export default App;
