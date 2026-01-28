import { BrowserRouter, Routes, Route } from "react-router-dom";

import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import MainPage from "./components/main/MainPage.jsx";

import CommunityList from "./components/community/CommunityList.jsx";
import CommunityDetail from "./components/community/CommunityDetail.jsx";

// 라우트 전용
import { Routes, Route} from 'react-router-dom';

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

export default function App() {
  return (
    <BrowserRouter>
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
    </BrowserRouter>
  );
}

