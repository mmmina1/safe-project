import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

//라우터 전용
import { Routes, Route, Link } from 'react-router-dom';
import Chatbot from './pages/AiService/Chatbot/Chatbot';
import './App.css';

import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import MainPage from './components/main/MainPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import SignupPage from './pages/SignupPage.jsx';

function App() {
  const location = useLocation();
  
  // 팝업창인지 확인 (window.opener가 있으면 팝업창)
  const isPopup = window.opener !== null;
  
  // 팝업창이거나 terms/privacy 페이지면 헤더와 푸터 숨김
  const showHeaderFooter = !isPopup && location.pathname === '/';

  return (
    <div className="app-root">
      <Header />

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
