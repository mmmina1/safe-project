// src/pages/KakaoLogoutCallbackPage.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function KakaoLogoutCallbackPage() {
  const navigate = useNavigate();

  useEffect(() => {
    // 혹시 남아 있을 수 있는 정보들 정리
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userName');
    localStorage.removeItem('loginProvider');

    // 메인으로 보내기
    navigate('/', { replace: true });
  }, [navigate]);

  return <div>로그아웃 중입니다...</div>;
}

export default KakaoLogoutCallbackPage;
