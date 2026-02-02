// src/pages/GoogleCallbackPage.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { axiosInstance } from '../api/axiosInstance';

function GoogleCallbackPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');

    if (!code) {
      alert('구글 인가 코드가 없습니다.');
      navigate('/login');
      return;
    }

    // 👉 백엔드로 code 전달
    axiosInstance
      .post('/api/auth/google', { code })
      .then((res) => {
        const { accessToken, email, name } = res.data;

        if (!accessToken) {
          throw new Error('토큰이 없습니다.');
        }

        // 토큰 저장
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('userEmail', email);
        localStorage.setItem('userName', name);

        // 메인 페이지 이동
        navigate('/');
      })
      .catch((err) => {
        console.error(err);
        alert('구글 로그인에 실패했습니다.');
        navigate('/login');
      });
  }, [navigate]);

  return <div>구글 로그인 처리 중입니다...</div>;
}

export default GoogleCallbackPage;
