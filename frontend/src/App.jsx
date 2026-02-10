// src/App.jsx
import 'bootstrap/dist/css/bootstrap.min.css';

//라우터 전용
import { Routes, Route, Link, useLocation} from 'react-router-dom';
import './App.css';

// AI 서비스 관련 페이지 (우리의 작업)
import Chatbot from './pages/AiService/Chatbot/Chatbot';
import LandingView from './pages/AiService/AiServiceHub/LandingView';
import Diagnosis from './pages/AiService/Diagnosis/Diagnosis';
import Simulator from './pages/AiService/Simulator/Simulator';
// 결제 관련 페이지
import Success from './pages/Payment/Success.jsx';
import Fail from './pages/Payment/Fail.jsx';

import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';


// 페이지 컴포넌트들
import MainPage from './components/main/MainPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import SignupPage from './pages/SignupPage.jsx';
import CommunityList from './components/community/CommunityList.jsx';
import ForgotPasswordPage from './pages/ForgotPasswordPage.jsx';
import ResetPasswordPage from './pages/ResetPasswordPage.jsx';
import Terms from './pages/terms';
import Privacy from './pages/privacy';
import CommunityPost from './components/community/CommunityPost.jsx';
import CommunityDetail from './components/community/CommunityDetail.jsx';
import ScrollToTop from './components/ScrollToTop.jsx';

// 관리자 영역
import AdminLayout from './layouts/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import DataPolicy from './pages/admin/DataPolicy';
import AdminRoute from './AdminRoute.jsx';

// 상품 페이지
import ProductPage from './pages/ServiceProduct/ProductPage.jsx';
import ProductDetailPage from './pages/ServiceProduct/ProductDetailPage.jsx';

// OAuth 콜백 페이지
import KakaoCallbackPage from './pages/KakaoCallbackPage.jsx';
import KakaoLogoutCallbackPage from './pages/KakaoLogoutCallbackPage.jsx';
import GoogleCallbackPage from './pages/GoogleCallbackPage.jsx';
import MonitoringPage from './components/monitoring/MonitoringPage.jsx';

import UserRoute from './UserRoute.jsx';
import MyPage from './pages/MyPage/MyPage';

//운영자 페이지
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
// src/App.jsx 상단 import 목록에 추가
import OperatorRoute from './OperatorRoute.jsx';

function App() {

  const location = useLocation();
  
  // 팝업창인지 확인 (window.opener가 있으면 팝업창)
  const isPopup = window.opener !== null;

  // 약관/개인정보 페이지 여부
  const isTermsOrPrivacy =
    location.pathname === '/terms' || location.pathname === '/privacy';

  // 팝업이거나 약관/개인정보 페이지면 헤더/푸터 숨김
  const showHeaderFooter = !isPopup && !isTermsOrPrivacy;

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

        {/* 헤더 */}
        {showHeaderFooter && <Header />}

        <main className="app-main">
          <div className="container">
            {/* 라우팅 영역 */}
            <Routes>
              {/* 메인/인증 */}
              <Route path="/" element={<MainPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/mypage" element={
                <UserRoute>
                  <MyPage />
                </UserRoute>} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />

              {/* 결제 관련 (우리의 작업) */}
              <Route path="/payment/success" element={<Success />} />
              <Route path="/payment/fail" element={<Fail />} />

              {/* AI / 모니터링 (임시로 MainPage 재사용) */}
              <Route path="/chatbot" element={<Chatbot />} />
              <Route path="/ai" element={<LandingView />} />
              <Route path="/ai/diagnosis" element={<Diagnosis />} />
              <Route path="/ai/simulator" element={<Simulator />} />

              {/* 4. 모니터링 (팀원 작업) */}
              <Route path="/monitoring" element={<MonitoringPage />} />

              {/* 커뮤니티 */}
              <Route path="/community" element={<CommunityList />} />
              <Route path="/community/new" element={<CommunityPost />} />
              <Route path="/community/:postId" element={<CommunityDetail />} />

              {/* 서비스 상품 */}
              <Route path="/product" element={<ProductPage />} />
              <Route path="/product/:productId" element={<ProductDetailPage />} />

              {/* OAuth 콜백 */}
              <Route path="/oauth/callback/kakao" element={<KakaoCallbackPage />} />
              <Route path="/oauth/logout/kakao" element={<KakaoLogoutCallbackPage />} />
              <Route path="/oauth/callback/google" element={<GoogleCallbackPage />} />

              {/* 약관/개인정보 */}
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />

              {/* 관리자 영역 */}
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

              {/* 운영자 페이지 */}
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

          {/* 푸터 */}
          {showHeaderFooter && <Footer />}
        </main>
      </div>
    </div>
  );
}

export default App;
