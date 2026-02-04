// src/pages/GoogleCallbackPage.jsx
import { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axiosInstance from "../api/axiosInstance";

function GoogleCallbackPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const isCalledRef = useRef(false);   //  중복 호출 방지용
  
  useEffect(() => {
    //  StrictMode 등으로 인해 effect가 두 번 도는 것 방지
    if (isCalledRef.current) return;
    isCalledRef.current = true;

    const params = new URLSearchParams(location.search);
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
        console.log('[GOOGLE FRONT] res = ', res.data);

        //  role까지 함께 꺼내기 (백엔드 LoginResponse 기준)
        const { accessToken, email, name, role } = res.data;

        if (!accessToken) {
          throw new Error('토큰이 없습니다.');
        }

        // 토큰 + 유저 정보 저장
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('userEmail', email || '');
        localStorage.setItem('userName', name || '');
        localStorage.setItem('loginProvider', 'GOOGLE');
        localStorage.setItem('role', role || 'USER');

        //  role에 따라 라우팅 분기
        if (role === 'ADMIN') {
          navigate('/admin', { replace: true });
        } else if (role === 'OPERATOR' || role === 'ROLE_OPERATOR') {
          // 백엔드가 ROLE_OPERATOR 로 줄 수도 있으니 둘 다 체크
          navigate('/operator', { replace: true });
        } else {
          navigate('/', { replace: true });
        }
      })
      .catch((err) => {
        console.error('[GOOGLE FRONT] 구글 로그인 실패', err.response?.data || err);
        alert('구글 로그인에 실패했습니다.');
        navigate('/login');
      });
  }, [location.search, navigate]);

  return <div>구글 로그인 처리 중입니다...</div>;
}

export default GoogleCallbackPage;
