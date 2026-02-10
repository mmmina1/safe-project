// src/pages/LoginPage.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';

// 카카오 OAuth 설정
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
  const [showPassword, setShowPassword] = useState(false);
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

      const res = await axiosInstance.post('/api/auth/login', {
        email,
        password,
      });

      console.log('[LOCAL LOGIN] response:', res.data);

      //  백엔드에서 내려주는 구조: { accessToken, email, name, role }
      const {
        accessToken,
        email: userEmail,
        name,
        role,
      } = res.data;

      if (!accessToken) {
        setMessage('로그인에는 성공했지만 토큰이 없습니다. 관리자에게 문의해 주세요.');
        return;
      }

      // 이름 fallback
      const fallbackName = email.includes('@') ? email.split('@')[0] : email;
      const finalName = name || fallbackName;

      //  공통 저장
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('userEmail', userEmail || email);
      localStorage.setItem('userName', finalName);
      localStorage.setItem('loginProvider', 'LOCAL');
      localStorage.setItem('role', role || 'USER');

      setMessage('로그인에 성공했습니다.');

      //  여기서 role 보고 분기
      if (role === 'ADMIN') {
        navigate('/admin', { replace: true });
      } else if (role === 'OPERATOR') {
        navigate('/operator', { replace: true });
      } else {
        // 일반 유저
        navigate('/', { replace: true });
      }
    } catch (err) {
      console.error(err);

      let errorMessage = '로그인 중 오류가 발생했습니다.';

      if (err.response && err.response.data) {
        const data = err.response.data;
        if (typeof data === 'string') {
          errorMessage = data;
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
      '&prompt=login';

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
      prompt: 'consent',
    });

    const googleAuthUrl = `${GOOGLE_AUTH_URL}?${params.toString()}`;
    window.location.href = googleAuthUrl;
  };

  return (
    <div className="auth-page">
      <div className="container auth-container">
        <div className="auth-card">
          <h2 className="auth-title">로그인</h2>
          <p className="auth-subtitle">
            등록된 계정으로 로그인하고 RISK WATCH의 AI 서비스를 이용해 보세요.
          </p>

          {message && (
            <div className="alert alert-info py-2 auth-alert" role="alert">
              {message}
            </div>
          )}

          {/* 이메일 / 비밀번호 로그인 폼 */}
          <form onSubmit={handleLogin}>
            {/* 이메일 */}
            <div className="mb-3">
              <label className="form-label auth-label">이메일</label>
              <input
                type="email"
                className="form-control auth-input"
                placeholder="example@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="off"
              />
            </div>

            {/* 비밀번호 */}
            <div className="mb-4">
              <label className="form-label auth-label">비밀번호</label>

              <div className="position-relative password-input-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-control auth-input pe-5"
                  placeholder="비밀번호"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                />

                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label="비밀번호 보기 토글"
                >
                  {showPassword ? (
                    // 눈 가린 아이콘
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      className="password-toggle-icon"
                    >
                      <path
                        d="M3 3l18 18"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                      <path
                        d="M10.58 10.58A3 3 0 0113.42 13.42"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        fill="none"
                      />
                      <path
                        d="M9.88 5.51A9.77 9.77 0 0112 5c5 0 9 3.5 10.5 7-0.52 1.31-1.34 2.54-2.38 3.6"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        fill="none"
                      />
                      <path
                        d="M6.18 6.18C4.16 7.39 2.64 9.15 1.5 12c0.7 1.76 1.82 3.34 3.2 4.6a10.54 10.54 0 003.12 1.94"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        fill="none"
                      />
                    </svg>
                  ) : (
                    // 일반 눈 아이콘
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      className="password-toggle-icon"
                    >
                      <path
                        d="M1.5 12C3 8.5 7 5 12 5s9 3.5 10.5 7c-1.5 3.5-5.5 7-10.5 7s-9-3.5-10.5-7z"
                        stroke="currentColor"
                        strokeWidth="2"
                        fill="none"
                      />
                      <circle
                        cx="12"
                        cy="12"
                        r="3"
                        stroke="currentColor"
                        strokeWidth="2"
                        fill="none"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>

             <button
            type="submit"
            className="btn btn-login-default w-100 auth-submit-btn"
            disabled={loading}
          >
            {loading ? '처리 중...' : '로그인'}
          </button>

          <div className="auth-bottom-row">
            <span className="auth-bottom-text">
              아직 계정이 없으신가요? <a href="/signup">회원가입</a>
            </span>
            <a href="/forgot-password" className="auth-link">
              비밀번호 찾기
            </a>
          </div>

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
      </div>
    </div>
  );
}

export default LoginPage;
