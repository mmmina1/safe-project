// src/pages/LoginPage.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance'; // 공용 axios 인스턴스 사용

// 카카오 OAuth 설정 (카카오 개발자 콘솔에 등록된 값과 동일해야 함)
const KAKAO_CLIENT_ID = '3eaf9384381a56ea64f0a95314dcb658';
const KAKAO_REDIRECT_URI = 'http://localhost:5173/oauth/callback/kakao';

// 구글 OAuth 설정 (.env 에서 Client ID 읽어옴)
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const GOOGLE_REDIRECT_URI = 'http://localhost:5173/oauth/callback/google';
const GOOGLE_AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState(null);   // 성공/실패 메시지
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // 일반 이메일/비밀번호 로그인
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setMessage('이메일과 비밀번호를 입력해 주세요.');
      return;
    }

    try {
      setLoading(true);
      setMessage(null);

      // baseURL + 인터셉터가 적용된 axiosInstance 사용
      const res = await axiosInstance.post('/api/auth/login', {
        email,
        password,
      });

      console.log('login response:', res.data); // 응답 구조 확인용

      // 백엔드에서 내려주는 JSON 예시: { accessToken: "...", name: "홍길동" }
      const token = res.data?.accessToken;
      const nameFromApi = res.data?.name || res.data?.username; // 필드명에 맞게 조정

      if (!token) {
        setMessage('로그인에는 성공했지만 토큰이 없습니다. 관리자에게 문의해 주세요.');
        return;
      }

      // 토큰 저장
      localStorage.setItem('accessToken', token);

      // 이름도 저장 (없으면 이메일 아이디 부분 사용)
      const fallbackName = email.includes('@') ? email.split('@')[0] : email;
      const finalName = nameFromApi || fallbackName;
      localStorage.setItem('userName', finalName);

      setMessage('로그인에 성공했습니다.');
      navigate('/');  // 메인 페이지로 이동
    } catch (err) {
      console.error(err);

      let errorMessage = '로그인 중 오류가 발생했습니다.';

      if (err.response && err.response.data) {
        const data = err.response.data;
        if (typeof data === 'string') {
          errorMessage = data;               // 예: "이메일 또는 비밀번호가 올바르지 않습니다."
        } else if (typeof data === 'object') {
          if (data.message) {
            errorMessage = data.message;
          } else {
            errorMessage = JSON.stringify(data);
          }
        }
      }

      setMessage(`로그인 실패: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  // 카카오 로그인 버튼 클릭 시
  const handleKakaoLogin = () => {
    const kakaoAuthUrl =
      'https://kauth.kakao.com/oauth/authorize?' +
      `client_id=${KAKAO_CLIENT_ID}` +
      `&redirect_uri=${encodeURIComponent(KAKAO_REDIRECT_URI)}` +
      '&response_type=code' +
      '&prompt=login'; // 매번 계정 선택/로그인 강제

    window.location.href = kakaoAuthUrl;
  };

  // 구글 로그인 버튼 클릭 시
  const handleGoogleLogin = () => {
    if (!GOOGLE_CLIENT_ID) {
      alert('구글 Client ID가 설정되지 않았습니다. .env 파일을 확인해 주세요.');
      return;
    }

    const params = new URLSearchParams({
      client_id: GOOGLE_CLIENT_ID,
      redirect_uri: GOOGLE_REDIRECT_URI,
      response_type: 'code',
      scope: 'openid profile email',
      access_type: 'offline',
      prompt: 'consent', // 매번 계정 선택/동의 화면
    });

    const googleAuthUrl = `${GOOGLE_AUTH_URL}?${params.toString()}`;
    window.location.href = googleAuthUrl;
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '480px' }}>
      <h2 className="mb-4 text-center">로그인</h2>

      {message && (
        <div className="alert alert-info py-2" role="alert">
          {message}
        </div>
      )}

      {/* 이메일 / 비밀번호 로그인 폼 */}
      <form onSubmit={handleLogin}>
        {/* 이메일 */}
        <div className="mb-3">
          <label className="form-label">이메일</label>
          <input
            type="email"
            className="form-control"
            placeholder="example@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="off"           // 브라우저 자동완성 방지
          />
        </div>

        {/* 비밀번호 */}
        <div className="mb-4">
          <label className="form-label">비밀번호</label>
          <input
            type="password"
            className="form-control"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"  // 브라우저 자동완성 방지
          />
        </div>

        <button
          type="submit"
          className="btn btn-login-default w-100"
          disabled={loading}
        >
          {loading ? '처리 중...' : '로그인'}
        </button>
      </form>

      {/* 구분선 */}
      <hr className="my-4" />

      {/* 카카오 로그인 버튼 */}
      <button
        type="button"
        className="btn btn-warning w-100 mb-2"
        onClick={handleKakaoLogin}
      >
        카카오로 로그인
      </button>

      {/* 구글 로그인 버튼 */}
      <button
        type="button"
        className="btn btn-google w-100"
        onClick={handleGoogleLogin}
      >
        구글로 로그인
      </button>
    </div>
  );
}

export default LoginPage;
