// src/App.jsx
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// 라이브러리 및 훅
import { Routes, Route, Link, useLocation } from 'react-router-dom';

// AI 서비스 관련 페이지 (우리의 작업)
import Chatbot from './pages/AiService/Chatbot/Chatbot';
import LandingView from './pages/AiService/AiServiceHub/LandingView';
import Diagnosis from './pages/AiService/Diagnosis/Diagnosis';
import Simulator from './pages/AiService/Simulator/Simulator';

// 공통 컴포넌트
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import ScrollToTop from './components/ScrollToTop.jsx';

// 일반 페이지 컴포넌트
import MainPage from './components/main/MainPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import SignupPage from './pages/SignupPage.jsx';
import MyPage from './pages/MyPage/MyPage.jsx';
import Terms from './pages/terms';
import Privacy from './pages/privacy';

// 결제 관련 페이지
import Success from './pages/Payment/Success.jsx';
import Fail from './pages/Payment/Fail.jsx';

// 커뮤니티 페이지
import CommunityList from './components/community/CommunityList.jsx';
import CommunityPost from './components/community/CommunityPost.jsx';
import CommunityDetail from './components/community/CommunityDetail.jsx';

// 상품 페이지
import ProductPage from './pages/ServiceProduct/ProductPage.jsx';
import ProductDetailPage from './pages/ServiceProduct/ProductDetailPage.jsx';

// 모니터링 및 인증 콜백 (팀원 작업)
import MonitoringPage from './components/monitoring/MonitoringPage.jsx';
import KakaoCallbackPage from './pages/KakaoCallbackPage.jsx';
import KakaoLogoutCallbackPage from './pages/KakaoLogoutCallbackPage.jsx';
import GoogleCallbackPage from './pages/GoogleCallbackPage.jsx';

// 관리자 및 운영자 영역 (팀원 작업)
import AdminLayout from './layouts/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import DataPolicy from './pages/admin/DataPolicy';
import AdminRoute from './AdminRoute.jsx';

import OperatorLayout from './pages/admin/operator/OperatorLayout.jsx';
import OperatorDashboard from './pages/admin/operator/OperatorDashboard.jsx';
import UserSearchPage from './pages/admin/operator/UserSearchPage.jsx';
import CsDashboardPage from './pages/admin/operator/CsDashboardPage.jsx';
import ServiceProductsPage from './pages/admin/operator/ServiceProductsPage.jsx';
import CommunityReportsPage from './pages/admin/operator/CommunityReportsPage.jsx';
import BlindReasonsPage from './pages/admin/operator/BlindReasonsPage.jsx';
import NoticesPage from './pages/admin/operator/NoticesPage.jsx';
import BannersPage from './pages/admin/operator/BannersPage.jsx';
import BlacklistPage from './pages/admin/operator/BlacklistPage.jsx';
import OperatorRoute from './OperatorRoute.jsx';

function App() {
  const location = useLocation();

  // 팝업창 여부 확인
  const isPopup = window.opener !== null;

  // 약관/개인정보 페이지 여부 확인
  const isTermsOrPrivacy =
    location.pathname === '/terms' || location.pathname === '/privacy';

  // 헤더와 푸터 표시 조건 (팝업이 아니고 약관 페이지도 아닐 때)
  const showHeaderFooter = !isPopup && !isTermsOrPrivacy;

  // 관리자 혹은 운영자 페이지 여부 확인
  const isAdminLike =
    location.pathname.startsWith('/admin') ||
    location.pathname.startsWith('/operator');

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

        {/* 헤더 영역 */}
        {showHeaderFooter && <Header />}

        <main className="app-main">
          <div className="container">
            {/* 상단 퀵 네비게이션 (관리자 모드가 아닐 때만 표시) */}
            {!isAdminLike && (
              <nav className="my-3 border-bottom pb-2">
                <Link to="/" className="me-3">🏠 홈</Link>
                <Link to="/chatbot">🤖 AI 챗봇</Link>
              </nav>
            )}

            {/* 라우팅 영역 */}
            <Routes>
              {/* 1. 메인 및 인증 관련 */}
              <Route path="/" element={<MainPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/mypage" element={<MyPage />} />

              {/* 2. 결제 관련 (우리의 작업) */}
              <Route path="/payment/success" element={<Success />} />
              <Route path="/payment/fail" element={<Fail />} />

              {/* 3. AI 서비스 관련 (우리의 작업) */}
              <Route path="/chatbot" element={<Chatbot />} />
              <Route path="/ai" element={<LandingView />} />
              <Route path="/ai/diagnosis" element={<Diagnosis />} />
              <Route path="/ai/simulator" element={<Simulator />} />
              
              {/* 4. 모니터링 (팀원 작업) */}
              <Route path="/monitoring" element={<MonitoringPage />} />

              {/* 5. 커뮤니티 */}
              <Route path="/community" element={<CommunityList />} />
              <Route path="/community/new" element={<CommunityPost />} />
              <Route path="/community/:postId" element={<CommunityDetail />} />

              {/* 6. 서비스 상품 */}
              <Route path="/product" element={<ProductPage />} />
              <Route path="/product/:productId" element={<ProductDetailPage />} />

              {/* 7. OAuth 소셜 로그인 콜백 (팀원 작업) */}
              <Route path="/oauth/callback/kakao" element={<KakaoCallbackPage />} />
              <Route path="/oauth/logout/kakao" element={<KakaoLogoutCallbackPage />} />
              <Route path="/oauth/callback/google" element={<GoogleCallbackPage />} />

              {/* 8. 약관 및 규정 */}
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />

              {/* 9. 관리자 영역 (AdminRoute 적용) */}
              <Route
                path="/admin"
                element={
                  <AdminRoute>
                    <AdminLayout />
                  </AdminRoute>
                }
              >
                <Route index element={<AdminDashboard />} />
                <Route path="manage" element={<UserManagement />} />
                <Route path="policy" element={<DataPolicy />} />
              </Route>

              {/* 10. 운영자 영역 (OperatorRoute 적용) */}
              <Route
                path="/operator"
                element={
                  <OperatorRoute>
                    <OperatorLayout />
                  </OperatorRoute>
                }
              >
                <Route index element={<OperatorDashboard />} />
                <Route path="users" element={<UserSearchPage />} />
                <Route path="cs" element={<CsDashboardPage />} />
                <Route path="products" element={<ServiceProductsPage />} />
                <Route path="community-reports" element={<CommunityReportsPage />} />
                <Route path="blind-reasons" element={<BlindReasonsPage />} />
                <Route path="notices" element={<NoticesPage />} />
                <Route path="banners" element={<BannersPage />} />
                <Route path="blacklist" element={<BlacklistPage />} />
              </Route>
            </Routes> 
          </div>

          {/* 푸터 영역 */}
          {showHeaderFooter && <Footer />}
        </main>
      </div>
    </div>
  );
}

export default App;