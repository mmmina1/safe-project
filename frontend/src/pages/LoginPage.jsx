// src/pages/LoginPage.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { axiosInstance } from '../api/axiosInstance'; //  공용 axios 인스턴스 사용

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState(null);   // 성공/실패 메시지
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setMessage('이메일과 비밀번호를 입력해 주세요.');
      return;
    }

    try {
      setLoading(true);
      setMessage(null);

      //  baseURL + 인터셉터가 적용된 axiosInstance 사용
      const res = await axiosInstance.post('/api/auth/login', {
        email,
        password,
      });

      console.log('login response:', res.data); // 응답 구조 확인용

      //  백엔드에서 내려주는 JSON 예시: { accessToken: "...", name: "홍길동" }
      const token = res.data?.accessToken;
      const nameFromApi = res.data?.name || res.data?.username; // 필드명에 맞게 조정

      if (!token) {
        // 토큰이 없으면 이상한 상황 → 에러처럼 처리
        setMessage('로그인에는 성공했지만 토큰이 없습니다. 관리자에게 문의해 주세요.');
        return;
      }

      // 토큰 저장
      localStorage.setItem('accessToken', token);

      // 이름도 저장 (없으면 이메일 아이디 부분 사용)
      const fallbackName = email.includes('@') ? email.split('@')[0] : email;
      const finalName = nameFromApi || fallbackName;
      localStorage.setItem('userName', finalName);

      // 메시지 & 페이지 이동
      setMessage('로그인에 성공했습니다.');
      navigate('/');  // URL은 그대로 / 유지

    } catch (err) {
      console.error(err);

      let errorMessage = '로그인 중 오류가 발생했습니다.';

      // 백엔드에서 400 + "이메일 또는 비밀번호가 올바르지 않습니다." 를 내려줄 때 처리
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
