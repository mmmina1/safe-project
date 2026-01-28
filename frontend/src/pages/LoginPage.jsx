// src/pages/LoginPage.jsx
import { useState } from 'react';
import axios from 'axios';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState(null);   // 성공/실패 메시지
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setMessage('이메일과 비밀번호를 입력해 주세요.');
      return;
    }

    try {
      setLoading(true);
      setMessage(null);

      const res = await axios.post('http://localhost:8081/api/auth/login', {
        email,
        password,
      });

      // 백엔드에서 "로그인에 성공했습니다" 라는 문자열을 내려주고 있음
      setMessage(res.data || '로그인에 성공했습니다');
      // TODO: 나중에 여기서 토큰 저장 / 페이지 이동 처리

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

  return (
    <div className="container mt-5" style={{ maxWidth: '480px' }}>
      <h2 className="mb-4 text-center">로그인</h2>

      {message && (
        <div className="alert alert-info py-2" role="alert">
          {message}
        </div>
      )}

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
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary w-100"
          disabled={loading}
        >
          {loading ? '처리 중...' : '로그인'}
        </button>
      </form>
    </div>
  );
}

export default LoginPage;
