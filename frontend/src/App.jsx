import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Terms from './pages/terms';
import Privacy from './pages/privacy';
import Footer from './components/Footer';
import './App.css';

function AppContent() {
  const location = useLocation();
  
  // 팝업창인지 확인 (window.opener가 있으면 팝업창)
  const isPopup = window.opener !== null;
  
  // 팝업창이거나 terms/privacy 페이지면 푸터 숨김
  const showFooter = !isPopup && location.pathname === '/';

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100vh',
      backgroundColor: '#ffffff',
      overflow: isPopup ? 'auto' : 'hidden'
    }}>
      
      {/* 메인 컨텐츠 영역 - flex: 1로 남은 공간 모두 차지 */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: isPopup ? 'auto' : 'hidden' }}>
        <Routes>
          <Route path="/" element={
            <div style={{ 
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#000000'
            }}>
              <h1 style={{ fontSize: '3rem', marginBottom: '20px', fontWeight: 'bold', color: '#000000' }}>Risk Watch</h1>
              <p style={{ fontSize: '1.2rem', color: '#0d6efd' }}>
                성공적으로 연결되었습니다 🔗
              </p>
            </div>
          } />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
        </Routes>
      </div>

      {/* 푸터는 메인 페이지이고 팝업이 아닐 때만 표시 */}
      {showFooter && <Footer />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
