// src/App.jsx
import 'bootstrap/dist/css/bootstrap.min.css';

//라우터 전용
import { Routes, Route, Link } from 'react-router-dom';
import Chatbot from './pages/AiService/Chatbot/Chatbot';
import './App.css';

import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';

// 페이지 컴포넌트들
import MainPage from './components/main/MainPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import SignupPage from './pages/SignupPage.jsx';

function App() {
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

