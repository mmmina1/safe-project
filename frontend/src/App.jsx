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

  return (
    //팝업창
    <div className="app-container"
      style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        height: isPopup ? '100vh' : 'auto',
        minHeight: '100vh',
        backgroundColor: '#ffffff',
        overflow: 'hidden'
      }}
    >
    <div className="app-root">
      <ScrollToTop/>
      {/* 헤더는 메인 페이지에서만 표시 */}
      {showHeaderFooter && <Header />}
      
      {/* 메인 컨텐츠 영역 */}
      <div 
        className="content-wrapper"
        style={{ 
          flex: 1, 
          display: 'flex', 
          flexDirection: 'column',
          height: isPopup ? '100vh' : 'auto',
          overflow: isPopup ? 'auto' : 'visible' 
        }}
      >
        <Routes>
          {/* 메인 페이지 */}
          <Route path="/" element={<MainPage />} />
          
          {/* 이용약관 페이지 */}
          <Route path="/terms" element={<Terms />} />
          
          {/* 개인정보처리방침 페이지 */}
          <Route path="/privacy" element={<Privacy />} />
        </Routes>
      </div>

          {/* 회원가입 */}
          <Route path="/signup" element={<SignupPage />} />

        <Route path="/chatbot" element={<Chatbot />} />
        <Route path="/monitoring" element={<MainPage />} />
        <Route path="/ai" element={<MainPage />} />
        
        {/* 커뮤니티 페이지 */}
        <Route path="/community" element={<CommunityList />} />
        <Route path='/community/new' element={<CommunityPost/>}/>
        <Route path='/community/:postId' element={<CommunityDetail/>}/>

        <Route path="/service" element={<MainPage />} />

        {/* 이용약관 페이지 */}
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
      </Routes>
      </div>
        {/* 푸터 */}
        {showHeaderFooter && <Footer/> }
        </main>
      </div>
    </div>
  );
}

export default App;