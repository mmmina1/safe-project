import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import MainPage from './components/main/MainPage.jsx';
import Terms from './pages/terms';
import Privacy from './pages/privacy';

import AdminLayout from './layouts/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import DataPolicy from './pages/admin/DataPolicy';

import './App.css';

function App() {
  const location = useLocation();

  // 팝업창인지 확인 (window.opener가 있으면 팝업창)
  const isPopup = window.opener !== null;

  // 관리자 페이지 여부 확인 (/admin으로 시작하는 모든 경로)
  const isAdminPage = location.pathname.startsWith('/admin');

  // 팝업창이거나 terms/privacy, 관리자 페이지면 헤더와 푸터 숨김
  const showHeaderFooter = !isPopup && !isAdminPage && location.pathname === '/';

  return (
    <div
      className="app-container"
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: isPopup ? '100vh' : 'auto',
        minHeight: '100vh',
        backgroundColor: '#ffffff',
        overflow: 'hidden'
      }}
    >
      {/* 헤더는 메인 페이지에서만 표시 */}
      {showHeaderFooter && <Header />}

      {/* 메인 컨텐츠 영역 */}
      <div
        className="content-wrapper"
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          height: isPopup ? '100vh' : 'auto',
          overflow: isPopup ? 'auto' : 'visible'
        }}
      >
        <Routes>
          {/* 메인 페이지 */}
          <Route path="/" element={<MainPage />} />

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
        </Routes>
      </div>

      <main className="app-main">
        <div className="container">
          {/* 네비/Routes는 container 안에 */}
          <nav className="my-3 border-bottom pb-2">
            <Link to="/" className="me-3">🏠 홈</Link>
            <Link to="/chatbot">🤖 AI 챗봇</Link>
          </nav>

      {/* 2. 화면 표시 영역 */}
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        <Route path="/chatbot" element={<Chatbot />} />
        <Route path="/monitoring" element={<MainPage />} />
        <Route path="/ai" element={<MainPage />} />
        <Route path="/community" element={<MainPage />} />
        <Route path="/service" element={<MainPage />} />

      </Routes>

      
    </div>
    <Footer />
    </main>
    </div>

  );
}

export default App;
