// KakaoCallbackPage.jsx
import { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

function KakaoCallbackPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const isCalledRef = useRef(false);

  useEffect(() => {
    if (isCalledRef.current) return;   // 중복 호출 방지
    isCalledRef.current = true;

    const params = new URLSearchParams(location.search);
    const code = params.get('code');

    if (!code) {
      alert('카카오 인가 코드가 존재하지 않습니다.');
      navigate('/login');
      return;
    }

    // ✅ 카카오 전용 백엔드 엔드포인트로 code 전송
    axios
      .post('http://localhost:8080/api/auth/kakao', { code })
      .then((res) => {
        console.log('[KAKAO FRONT] res = ', res.data);

        // 백엔드 LoginResponse 구조에 맞게 저장
        // { accessToken, email, name }
        const { accessToken, email, name } = res.data;

        // TODO: 토큰/유저정보 원하는 위치에 저장
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('userEmail', email);
        localStorage.setItem('userName', name);

        alert('카카오 로그인에 성공했습니다.');
        navigate('/');   // 메인 혹은 마이페이지 등 원하는 경로
      })
      .catch((err) => {
        console.error('[KAKAO FRONT] 카카오 로그인 처리 오류', err);
        console.error('[KAKAO FRONT] response data = ', err.response?.data);
        alert('카카오 로그인 처리 중 오류가 발생했습니다.');
        navigate('/login');
      });
  }, [location.search, navigate]);

  return <div>카카오 로그인 처리 중...</div>;
}

export default KakaoCallbackPage;
