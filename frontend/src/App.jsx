// src/App.jsx
import 'bootstrap/dist/css/bootstrap.min.css';
import Footer from './components/Footer.jsx';
import { Routes, Route, Link } from 'react-router-dom';
import Chatbot from './pages/AiService/Chatbot/Chatbot';
import './App.css';

import Header from './components/Header.jsx';


// 페이지 컴포넌트들
import MainPage from './components/main/MainPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import SignupPage from './pages/SignupPage.jsx';
import MyPage from './pages/MyPage/MyPage.jsx';
import Diagnosis from './pages/AiService/Diagnosis/Diagnosis';

// 라우트 전용


function App() {
  return (
    <div className="container">
      {/* 1. 메뉴판 (네비게이션) 추가 */}
      <nav className="my-3 border-bottom pb-2">
        <Link to="/" className="me-3">🏠 홈</Link>
        <Link to="/chatbot" className="me-3">🤖 AI 챗봇</Link>
        <Link to="/diagnosis" className="me-3">🛡️ AI 진단</Link>
        <Link to="/mypage">👤 마이페이지</Link>
      </nav>
      {/* 2. 화면 표시 영역 */}
      <Routes>
        <Route path="/" element={
          /* 기존 코드 보존 (홈 화면) */
          <div className="text-center mt-5">
            <h1>초기 세팅 확인</h1>
            <p className="text-primary">스프링이랑 연결 성공했다!</p>
          </div>
        } />

        <Route path="/chatbot" element={<Chatbot />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/diagnosis" element={<Diagnosis />} />
      </Routes>

      <Footer />
    </div>
  );
}

export default App;

