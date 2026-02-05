// src/pages/SignupPage.jsx
import { useState } from 'react';
import axios from 'axios';

function SignupPage() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState(null);   // 성공/실패 메시지
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !name || !password) {
      setMessage('모든 값을 입력해 주세요.');
      return;
    }

    try {
      setLoading(true);
      setMessage(null);

      const res = await axios.post('http://localhost:8080/api/auth/signup', {
        email,
        name,
        password,
      });

      setMessage(res.data || '회원가입이 완료되었습니다.');
      setEmail('');
      setName('');
      setPassword('');
    } catch (err) {
      console.error(err);

      let errorMessage = '회원가입 중 오류가 발생했습니다.';

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

      setMessage(`회원가입 실패: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="container auth-container">
        <div className="auth-card">
          <h2 className="auth-title">회원가입</h2>
          <p className="auth-subtitle">
            리스크 워치의 AI 서비스를 이용하기 위해 간단히 가입해 주세요.
          </p>

          {message && (
            <div className="alert alert-info py-2 auth-alert" role="alert">
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* 이메일 */}
            <div className="mb-3">
              <label className="form-label auth-label">이메일</label>
              <input
                type="email"
                className="form-control auth-input"
                placeholder="example@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* 이름 */}
            <div className="mb-3">
              <label className="form-label auth-label">이름 / 닉네임</label>
              <input
                type="text"
                className="form-control auth-input"
                placeholder="표시용 이름을 입력하세요"
                value={name}
                onChange={(e) => setName(e.target.value)}
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
              <small className="form-text text-muted">
                영문, 숫자를 포함해 8자 이상을 추천합니다.
              </small>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100 auth-submit-btn"
              disabled={loading}
            >
              {loading ? '처리 중...' : '회원가입'}
            </button>

            <p className="auth-bottom-text">
              이미 계정이 있으신가요? <a href="/login">로그인</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;
