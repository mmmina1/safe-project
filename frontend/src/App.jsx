<<<<<<< HEAD
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import Chatbot from './pages/AiService/Chatbot/Chatbot';
=======
// frontend/src/App.jsx
import 'bootstrap/dist/css/bootstrap.min.css';

// 라우터
import { Routes, Route, Link, useLocation } from 'react-router-dom';
>>>>>>> develop
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

<<<<<<< HEAD
// 컴포넌트 임포트 (중복 제거 완료)
import Header from './components/Header.jsx'; // Header가 필요해 보여서 추가했습니다
import Footer from './components/Footer.jsx'; // Footer가 필요해 보여서 추가했습니다
=======
// 공통 컴포넌트
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import ScrollToTop from './components/ScrollToTop.jsx';

// 페이지 컴포넌트들
>>>>>>> develop
import MainPage from './components/main/MainPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import SignupPage from './pages/SignupPage.jsx';
import CommunityList from './components/community/CommunityList.jsx';
<<<<<<< HEAD
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
=======
import CommunityPost from './components/community/CommunityPost.jsx';
import CommunityDetail from './components/community/CommunityDetail.jsx';

import Terms from './pages/terms';
import Privacy from './pages/privacy';

import Chatbot from './pages/AiService/Chatbot/Chatbot';

// 관리자 영역
import AdminLayout from './layouts/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import DataPolicy from './pages/admin/DataPolicy';

// 상품 페이지
import ProductPage from './pages/ServiceProduct/ProductPage.jsx';
import ProductDetailPage from './pages/ServiceProduct/ProductDetailPage.jsx';

// OAuth 콜백 페이지
import KakaoCallbackPage from './pages/KakaoCallbackPage.jsx';
import KakaoLogoutCallbackPage from './pages/KakaoLogoutCallbackPage.jsx';
import GoogleCallbackPage from './pages/GoogleCallbackPage.jsx';

function App() {
  const location = useLocation();

  // 팝업창인지 확인 (window.opener가 있으면 팝업창)
  const isPopup = window.opener !== null;

  // 약관/개인정보 페이지 여부
  const isTermsOrPrivacy =
    location.pathname === '/terms' || location.pathname === '/privacy';

  // 팝업이거나 약관/개인정보 페이지면 헤더/푸터 숨김
  const showHeaderFooter = !isPopup && !isTermsOrPrivacy;

  return (
    <div
      className="app-container"
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        overflow: isPopup ? 'auto' : 'visible',
      }}
    >
      <div className="app-root">
        <ScrollToTop />

        {/* 헤더 */}
        {showHeaderFooter && <Header />}

        <main className="app-main">
          <div className="container">
            {/* 네비게이션 */}
            <nav className="my-3 border-bottom pb-2">
              <Link to="/" className="me-3">
                🏠 홈
              </Link>
              <Link to="/chatbot">🤖 AI 챗봇</Link>
            </nav>

            {/* 라우팅 영역 */}
            <Routes>
              {/* 메인/인증 */}
              <Route path="/" element={<MainPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />

              {/* AI / 모니터링 (임시로 MainPage 재사용) */}
              <Route path="/chatbot" element={<Chatbot />} />
              <Route path="/monitoring" element={<MainPage />} />
              <Route path="/ai" element={<MainPage />} />

              {/* 커뮤니티 */}
              <Route path="/community" element={<CommunityList />} />
              <Route path="/community/new" element={<CommunityPost />} />
              <Route path="/community/:postId" element={<CommunityDetail />} />

              {/* 서비스 상품 */}
              <Route path="/product" element={<ProductPage />} />
              <Route path="/product/:productId" element={<ProductDetailPage />} />

              {/* OAuth 콜백 */}
              <Route
                path="/oauth/callback/kakao"
                element={<KakaoCallbackPage />}
              />
              <Route
                path="/oauth/logout/kakao"
                element={<KakaoLogoutCallbackPage />}
              />
              <Route
                path="/oauth/callback/google"
                element={<GoogleCallbackPage />}
              />

              {/* 약관/개인정보 */}
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />

              {/* 관리자 영역 */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="manage" element={<UserManagement />} />
                <Route path="policy" element={<DataPolicy />} />
              </Route>
            </Routes>
          </div>

          {/* 푸터 */}
          {showHeaderFooter && <Footer />}
        </main>
      </div>
>>>>>>> develop
    </div>
  );
}

export default App;