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

    //  카카오 전용 백엔드 엔드포인트로 code 전송
    axios
      .post('http://localhost:8080/api/auth/kakao', { code })
      .then((res) => {
        console.log('[KAKAO FRONT] res = ', res.data);

        // 백엔드 LoginResponse 구조에 맞게 꺼내기
        // { accessToken, email, name, kakaoAccessToken }
        const {
          accessToken,
          email,
          name,
          kakaoAccessToken,   //  추가
        } = res.data;

        if (!accessToken) {
          alert('로그인에는 성공했지만 토큰 정보가 없습니다. 관리자에게 문의해 주세요.');
          navigate('/login');
          return;
        }

        // 우리 서비스 JWT + 유저 정보 저장
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('userEmail', email || '');
        localStorage.setItem('userName', name || '');
        localStorage.setItem('loginProvider', 'KAKAO');

        //  카카오 access token도 저장 (로그아웃 시 사용)
        if (kakaoAccessToken) {
          localStorage.setItem('kakaoAccessToken', kakaoAccessToken);
        } else {
          console.warn('[KAKAO FRONT] kakaoAccessToken이 응답에 없습니다.');
        }

        alert('카카오 로그인에 성공했습니다.');
        navigate('/');   // 메인 또는 원하는 페이지
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
