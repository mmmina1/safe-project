import { BrowserRouter, Routes, Route } from "react-router-dom";

import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import MainPage from "./components/main/MainPage.jsx";

import CommunityList from "./components/community/CommunityList.jsx";
import CommunityDetail from "./components/community/CommunityDetail.jsx";

// 페이지 컴포넌트들
import MainPage from './components/main/MainPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import SignupPage from './pages/SignupPage.jsx';
import CommunityList from './components/community/CommunityList.jsx';

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

export default function App() {
  return (
    <BrowserRouter>
      <Header />
    
      <main className="app-main">
        <div className="container">
        {/* 네비/Routes는 container 안에 */}
        <nav className="my-3 border-bottom pb-2">
          <Link to="/" className="me-3">🏠 홈</Link>
          <Link to="/chatbot">🤖 AI 챗봇</Link>
        </nav>

          {/* 회원가입 */}
          <Route path="/signup" element={<SignupPage />} />

        <Route path="/chatbot" element={<Chatbot />} />
        <Route path="/monitoring" element={<MainPage />} />
        <Route path="/ai" element={<MainPage />} />
        <Route path="/community" element={<CommunityList />} />
        <Route path="/service" element={<MainPage />} />

      <Footer />
    </BrowserRouter>
  );
}

