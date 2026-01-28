// src/pages/SignupPage.jsx
import { useState } from 'react';
import axios from 'axios';

function SignupPage() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState(null);   // 성공/실패 메시지
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // (간단한 프론트 유효성 검사)
    if (!email || !name || !password) {
      setMessage('모든 값을 입력해 주세요.');
      return;
    }

    try {
      setLoading(true);
      setMessage(null);

      const res = await axios.post('http://localhost:8081/api/auth/signup', {
        email,
        name,
        password,
      });

      setMessage(res.data || '회원가입이 완료되었습니다.');
      // 필요하면 여기서 input 초기화
      setEmail('');
      setName('');
      setPassword('');
        } catch (err) {
      console.error(err); // 콘솔에서 실제 응답 구조 확인용

      let errorMessage = '회원가입 중 오류가 발생했습니다.';

      if (err.response && err.response.data) {
        const data = err.response.data;

        // 1) 백엔드가 순수 문자열을 내려주는 경우
        if (typeof data === 'string') {
          errorMessage = data;
        }
        // 2) 백엔드가 JSON 객체를 내려주는 경우 (예: { message: "이미 사용 중인 이메일입니다." })
        else if (typeof data === 'object') {
          if (data.message) {
            errorMessage = data.message;
          } else {
            // message 필드가 없으면 그냥 객체 전체를 문자열로
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
    <div className="container mt-5" style={{ maxWidth: '480px' }}>
      <h2 className="mb-4 text-center">회원가입</h2>

      {message && (
        <div className="alert alert-info py-2" role="alert">
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit}>
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

        {/* 이름 */}
        <div className="mb-3">
          <label className="form-label">이름 / 닉네임</label>
          <input
            type="text"
            className="form-control"
            placeholder="표시용 이름을 입력하세요"
            value={name}
            onChange={(e) => setName(e.target.value)}
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
          {loading ? '처리 중...' : '회원가입'}
        </button>
      </form>
    </div>
  );
}

export default SignupPage;
