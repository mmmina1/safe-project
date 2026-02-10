// src/App.jsx
import 'bootstrap/dist/css/bootstrap.min.css';

//라우터 전용
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import Chatbot from './pages/AiService/Chatbot/Chatbot';
import './App.css';

// Toast 관련
import { useToast, ToastContainer } from './components/Toast';
import { ToastContext } from './contexts/ToastContext';

import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';

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

import AdminLayout from './layouts/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import DataPolicy from './pages/admin/DataPolicy';

//상품 페이지 컴포넌트
import ProductPage from './pages/ServiceProduct/ProductPage.jsx';
import ProductDetailPage from './pages/ServiceProduct/ProductDetailPage.jsx';

// 운영자 페이지 컴포넌트들
import OperatorLayout from './pages/operator/OperatorLayout.jsx';
import OperatorDashboard from './pages/operator/OperatorDashboard.jsx';
import UserSearchPage from './pages/operator/UserSearchPage.jsx';
import CsDashboardPage from './pages/operator/CsDashboardPage.jsx';
import ServiceProductsPage from './pages/operator/ServiceProductsPage.jsx';
import CommunityReportsPage from './pages/operator/CommunityReportsPage.jsx';
import BlindReasonsPage from './pages/operator/BlindReasonsPage.jsx';
import NoticesPage from './pages/operator/NoticesPage.jsx';
import BannersPage from './pages/operator/BannersPage.jsx';
import BlacklistPage from './pages/operator/BlacklistPage.jsx';

function AppContent() {
  const location = useLocation();
  
  // 팝업창인지 확인 (window.opener가 있으면 팝업창)
  const isPopup = window.opener !== null;
  
  // 운영자 영역인지 확인
  const isOperatorArea = location.pathname.startsWith('/operator');
  
  // 팝업창이면 헤더와 푸터 숨김
  const showHeaderFooter = !isPopup;
  
  return (
    <>
      <ScrollToTop/>
      {/* 헤더는 항상 표시 (팝업 제외) */}
      {showHeaderFooter && <Header />}
    
      <main className="app-main">
        <Routes>
          {/* 운영자 영역 - 완전히 독립된 레이아웃 (Header/Footer 없음) */}
          <Route path="/operator" element={<OperatorLayout />}>
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

          {/* 일반 사용자 영역 */}
          <Route path="/" element={
            <div className="container">
              <nav className="my-3 border-bottom pb-2">
                <Link to="/" className="me-3">🏠 홈</Link>
                <Link to="/chatbot">🤖 AI 챗봇</Link>
              </nav>
              <MainPage />
            </div>
          } />
          <Route path="/login" element={
            <div className="container">
              <nav className="my-3 border-bottom pb-2">
                <Link to="/" className="me-3">🏠 홈</Link>
                <Link to="/chatbot">🤖 AI 챗봇</Link>
              </nav>
              <LoginPage />
            </div>
          } />
          <Route path="/signup" element={
            <div className="container">
              <nav className="my-3 border-bottom pb-2">
                <Link to="/" className="me-3">🏠 홈</Link>
                <Link to="/chatbot">🤖 AI 챗봇</Link>
              </nav>
              <SignupPage />
            </div>
          } />

          <Route path="/chatbot" element={<Chatbot />} />
          <Route path="/monitoring" element={
            <div className="container">
              <nav className="my-3 border-bottom pb-2">
                <Link to="/" className="me-3">🏠 홈</Link>
                <Link to="/chatbot">🤖 AI 챗봇</Link>
              </nav>
              <MainPage />
            </div>
          } />
          <Route path="/ai" element={
            <div className="container">
              <nav className="my-3 border-bottom pb-2">
                <Link to="/" className="me-3">🏠 홈</Link>
                <Link to="/chatbot">🤖 AI 챗봇</Link>
              </nav>
              <MainPage />
            </div>
          } />
          
          {/* 커뮤니티 페이지 */}
          <Route path="/community" element={
            <div className="container">
              <nav className="my-3 border-bottom pb-2">
                <Link to="/" className="me-3">🏠 홈</Link>
                <Link to="/chatbot">🤖 AI 챗봇</Link>
              </nav>
              <CommunityList />
            </div>
          } />
          <Route path='/community/new' element={
            <div className="container">
              <nav className="my-3 border-bottom pb-2">
                <Link to="/" className="me-3">🏠 홈</Link>
                <Link to="/chatbot">🤖 AI 챗봇</Link>
              </nav>
              <CommunityPost/>
            </div>
          }/>
          <Route path='/community/:postId' element={
            <div className="container">
              <nav className="my-3 border-bottom pb-2">
                <Link to="/" className="me-3">🏠 홈</Link>
                <Link to="/chatbot">🤖 AI 챗봇</Link>
              </nav>
              <CommunityDetail/>
            </div>
          }/>

          {/* 서비스 상품 페이지 */}
          <Route path="/product" element={
            <div className="container">
              <nav className="my-3 border-bottom pb-2">
                <Link to="/" className="me-3">🏠 홈</Link>
                <Link to="/chatbot">🤖 AI 챗봇</Link>
              </nav>
              <ProductPage />
            </div>
          } />
          <Route path='/product/:productId' element={
            <div className="container">
              <nav className="my-3 border-bottom pb-2">
                <Link to="/" className="me-3">🏠 홈</Link>
                <Link to="/chatbot">🤖 AI 챗봇</Link>
              </nav>
              <ProductDetailPage/>
            </div>
          }/>

          {/* 이용약관 페이지 */}
          <Route path="/terms" element={
            <div className="container">
              <nav className="my-3 border-bottom pb-2">
                <Link to="/" className="me-3">🏠 홈</Link>
                <Link to="/chatbot">🤖 AI 챗봇</Link>
              </nav>
              <Terms />
            </div>
          } />
          
          {/* 개인정보처리방침 페이지 */}
          <Route path="/privacy" element={
            <div className="container">
              <nav className="my-3 border-bottom pb-2">
                <Link to="/" className="me-3">🏠 홈</Link>
                <Link to="/chatbot">🤖 AI 챗봇</Link>
              </nav>
              <Privacy />
            </div>
          } />

          {/* 관리자 영역 */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="manage" element={<UserManagement />} />
            <Route path="policy" element={<DataPolicy />} />
          </Route>
        </Routes>
      </main>
      {/* 푸터는 운영자 영역 제외하고 표시 */}
      {showHeaderFooter && !isOperatorArea && <Footer />}
    </>
  );
}

function App() {
  const toast = useToast();
  
  return (
    <ToastContext.Provider value={toast}>
      <div className="app-container"
        style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          minHeight: '100vh',
          overflow: window.opener !== null ? 'auto' : 'visible'
        }}
      >
        <div className="app-root">
          <AppContent />
        </div>
      </div>
      <ToastContainer toasts={toast.toasts} onRemove={toast.removeToast} />
    </ToastContext.Provider>
  );
}

export default App;
