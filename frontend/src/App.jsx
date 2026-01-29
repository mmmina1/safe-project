import { BrowserRouter, Routes, Route } from "react-router-dom";

//라우터 전용
import { Routes, Route, Link, useLocation} from 'react-router-dom';
import Chatbot from './pages/AiService/Chatbot/Chatbot';
import './App.css';

import CommunityList from "./components/community/CommunityList.jsx";
import CommunityDetail from "./components/community/CommunityDetail.jsx";

// 페이지 컴포넌트들
import MainPage from './components/main/MainPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import SignupPage from './pages/SignupPage.jsx';
import CommunityList from './components/community/CommunityList.jsx';

import Terms from './pages/terms';
import Privacy from './pages/privacy';
import CommunityPost from './components/community/CommunityPost.jsx';
import CommunityDetail from './components/community/CommunityDetail.jsx';
import ScrollToTop from './components/ScrollToTop.jsx';

function App() {

  const location = useLocation();
  
  // 팝업창인지 확인 (window.opener가 있으면 팝업창)
  const isPopup = window.opener !== null;
  
  // 팝업창이거나 terms/privacy 페이지면 헤더와 푸터 숨김
  const showHeaderFooter = !isPopup;

  // 팝업창인 경우 간단한 레이아웃
  if (isPopup) {
    return (
      <Routes>
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
      </Routes>
    );
  }

  // 일반 페이지 레이아웃
  return (
    <div className="app-container">
      <div className="app-root">
        {/* 헤더 */}
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
              <Route path="/community" element={<CommunityList />} />
              <Route path="/service" element={<MainPage />} />
            </Routes>
          </div>
        </main>

        {/* 푸터 */}
        <Footer />
      </div>
    </div>
  );
}

export default App;