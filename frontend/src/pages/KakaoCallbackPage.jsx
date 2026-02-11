// KakaoCallbackPage.jsx
import { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

function KakaoCallbackPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const isCalledRef = useRef(false);

  useEffect(() => {
    if (isCalledRef.current) return; // 중복 호출 방지
    isCalledRef.current = true;

    const params = new URLSearchParams(location.search);
    const code = params.get('code');

    if (!code) {
      alert('카카오 인가 코드가 존재하지 않습니다.');
      navigate('/login');
      return;
    }

    // 카카오 전용 백엔드 엔드포인트로 code 전송
    axios
      .post('http://localhost:8080/api/auth/kakao', { code })
      .then((res) => {
        console.log('[KAKAO FRONT] res = ', res.data);

        // { accessToken, email, name, role } 구조
        const { accessToken, email, name, role } = res.data;

        if (!accessToken) {
          alert('로그인에는 성공했지만 토큰 정보가 없습니다. 관리자에게 문의해 주세요.');
          navigate('/login');
          return;
        }

        // JWT + 유저 정보 저장
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('userEmail', email || '');
        localStorage.setItem('userName', name || '');
        localStorage.setItem('loginProvider', 'KAKAO');
        localStorage.setItem('role', role || 'USER');

        // 역할에 따라 분기
        if (role === 'ADMIN') {
          navigate('/admin', { replace: true });
        } else {
          navigate('/', { replace: true });
        }
      })
      .catch((err) => {
        console.error('[KAKAO FRONT] 카카오 로그인 처리 오류', err);
        console.error('[KAKAO FRONT] response data = ', err.response?.data);

        const resp = err.response;
        const status = resp?.status;
        const data = resp?.data;

        //  계정 상태 관련 응답 처리 (백엔드에서 내려준 메시지 그대로 사용)
        if (status === 403 || status === 423) {
          // 예: { code: 'ACCOUNT_BLOCKED', message: '보안 정책에 의해 차단된 계정입니다.' }
          const message =
            data?.message ||
            '해당 계정은 현재 서비스 이용이 제한되어 있습니다. 관리자에게 문의해 주세요.';
          alert(message);
          navigate('/login');
          return;
        }

        //  그 외 4xx (잘못된 요청 등)
        if (status && status >= 400 && status < 500) {
          const message =
            data?.message ||
            '요청을 처리하는 중 문제가 발생했습니다. 입력 정보를 다시 확인해 주세요.';
          alert(message);
          navigate('/login');
          return;
        }

        //  진짜 서버 오류 (5xx / 네트워크 오류 등)
        alert('카카오 로그인 처리 중 서버 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.');
        navigate('/login');
      });
  }, [location.search, navigate]);

  return <div>카카오 로그인 처리 중...</div>;
}

export default KakaoCallbackPage;
