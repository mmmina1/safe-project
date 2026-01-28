// src/App.jsx
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';

// 페이지 컴포넌트들
import MainPage from './components/main/MainPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import SignupPage from './pages/SignupPage.jsx';

// 라우트 전용
import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <div id="root">
      <Header />

      <Routes>
        {/* 메인 */}
        <Route path="/" element={<MainPage />} />

        {/* 로그인 */}
        <Route path="/login" element={<LoginPage />} />

        {/* 회원가입 */}
        <Route path="/signup" element={<SignupPage />} />

        {/* 나중에 구현 예정인 메뉴들 */}
        <Route path="/monitoring" element={<MainPage />} />
        <Route path="/ai" element={<MainPage />} />
        <Route path="/community" element={<MainPage />} />
        <Route path="/service" element={<MainPage />} />
      </Routes>

      <Footer />
    </div>
  );
}

export default App;
