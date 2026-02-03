import { Routes, Route, Link, useLocation } from 'react-router-dom';
import Chatbot from './pages/AiService/Chatbot/Chatbot';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

// 컴포넌트 임포트 (중복 제거 완료)
import Header from './components/Header.jsx'; // Header가 필요해 보여서 추가했습니다
import Footer from './components/Footer.jsx'; // Footer가 필요해 보여서 추가했습니다
import MainPage from './components/main/MainPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import SignupPage from './pages/SignupPage.jsx';
import CommunityList from './components/community/CommunityList.jsx';
import CommunityDetail from './components/community/CommunityDetail.jsx';
import CommunityPost from './components/community/CommunityPost.jsx';
import Terms from './pages/terms';
import Privacy from './pages/privacy';
import ScrollToTop from './components/ScrollToTop.jsx';

function App() {
  const location = useLocation();
  
  // 팝업창인지 확인
  const isPopup = window.opener !== null;
  
  // 팝업창이거나 특정 페이지면 헤더/푸터 숨김
  const isTermsOrPrivacy = location.pathname === '/terms' || location.pathname === '/privacy';
  const showHeaderFooter = !isPopup && !isTermsOrPrivacy;

  return (
    <div className="app-container"
      style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        minHeight: '100vh',
      }}
    >
      <ScrollToTop />
      {showHeaderFooter && <Header />}
      
      <main className="app-main" style={{ flex: 1 }}>
        <div className="container">
          {/* 네비게이션바 (필요 없으면 삭제하세요) */}
          <nav className="my-3 border-bottom pb-2">
            <Link to="/" className="me-3">🏠 홈</Link>
            <Link to="/chatbot">🤖 AI 챗봇</Link>
          </nav>

          <Routes>
            {/* 메인 및 인증 */}
            <Route path="/" element={<MainPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />

            {/* AI 및 서비스 */}
            <Route path="/chatbot" element={<Chatbot />} />
            <Route path="/monitoring" element={<MainPage />} />
            <Route path="/ai" element={<MainPage />} />
            <Route path="/service" element={<MainPage />} />

            {/* 커뮤니티 */}
            <Route path="/community" element={<CommunityList />} />
            <Route path="/community/:id" element={<CommunityDetail />} />
            <Route path="/community/post" element={<CommunityPost />} />

            {/* 약관 및 개인정보 */}
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
          </Routes>
        </div>
      </main>

      {showHeaderFooter && <Footer />}
    </div>
  );
}

export default App;