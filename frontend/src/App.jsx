// src/App.jsx
import 'bootstrap/dist/css/bootstrap.min.css';

//라우터 전용
import { Routes, Route, Link, useLocation} from 'react-router-dom';
import Chatbot from './pages/AiService/Chatbot/Chatbot';
import './App.css';

import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';

// 페이지 컴포넌트들
import MainPage from './components/main/MainPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import SignupPage from './pages/SignupPage.jsx';
import CommunityList from './components/community/CommunityList.jsx';
import MonitoringPage from "./components/monitoring/MonitoringPage";
 
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

function App() {

  const location = useLocation();
  
  // 팝업창인지 확인 (window.opener가 있으면 팝업창)
  const isPopup = window.opener !== null;
  
  // 팝업창이거나 terms/privacy 페이지면 헤더와 푸터 숨김
  const showHeaderFooter = !isPopup;
  
  return (
    //팝업창
    <div className="app-container"
      style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        minHeight: '100vh',
        overflow: isPopup ? 'auto' : 'visible'
      }}
    >
    <div className="app-root">
      <ScrollToTop/>
      {/* 헤더는 메인 페이지에서만 표시 */}
      {showHeaderFooter && <Header />}
    
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
        <Route path="/monitoring" element={<MonitoringPage />} />
        <Route path="/ai" element={<MainPage />} />
        
        {/* 커뮤니티 페이지 */}
        <Route path="/community" element={<CommunityList />} />
        <Route path='/community/new' element={<CommunityPost/>}/>
        <Route path='/community/:postId' element={<CommunityDetail/>}/>

        {/* 서비스 상품 페이지 */}
        <Route path="/product" element={<ProductPage />} />
        <Route path='/product/:productId' element={<ProductDetailPage/>}/>

        {/* 이용약관 페이지 */}
        <Route path="/terms" element={<Terms />} />
        
        {/* 개인정보처리방침 페이지 */}
        <Route path="/privacy" element={<Privacy />} />

        {/* 관리자 영역 */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="manage" element={<UserManagement />} />
            <Route path="policy" element={<DataPolicy />} />
          </Route>
      </Routes>

      
    </div>
    {/* 푸터는 메인 페이지에서만 표시 */}
    {showHeaderFooter && <Footer />}
    </main>
  </div>
</div>
    
  );
}

export default App;
