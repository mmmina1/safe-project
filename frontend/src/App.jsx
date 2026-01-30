import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Footer from './components/Footer.jsx';
import MainPage from './components/main/MainPage.jsx';
import Terms from './pages/terms';
import Header from './components/Header.jsx';
import Privacy from './pages/privacy';
import './App.css';
import MonitoringPage from './components/monitoring/MonitoringPage.jsx';

function App() {
  const location = useLocation();
  
  // 팝업창인지 확인 (window.opener가 있으면 팝업창)
  const isPopup = window.opener !== null;
  
  // 팝업창이거나 terms/privacy 페이지면 헤더와 푸터 숨김
  const showHeaderFooter = !isPopup && location.pathname === '/';

  return (
    <div 
      className="app-container"      
    >
      {/* 헤더는 메인 페이지에서만 표시 */}
      {showHeaderFooter && <Header />}
      
      {/* 메인 컨텐츠 영역 */}
      <div 
        className="content-wrapper"      
      >
        <Routes>
          {/* 메인 페이지 */}
          <Route path="/" element={<MainPage />} />
          {/* 관제 페이지 */}
          <Route path="/monitoring" element={<MonitoringPage />} />
          {/* 이용약관 페이지 */}
          <Route path="/terms" element={<Terms />} />
          
          {/* 개인정보처리방침 페이지 */}
          <Route path="/privacy" element={<Privacy />} />
        </Routes>
      </div>

      {/* 푸터는 메인 페이지에서만 표시 */}
      {showHeaderFooter && <Footer />}
    </div>
    
  );
}

export default App;
