import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance'; // 경로는 프로젝트 구조에 맞게

function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    if (!email.trim()) {
      setMessage('이메일을 입력해 주세요.');
      return;
    }

    try {
      setLoading(true);

      //  백엔드 비밀번호 재설정 토큰 발급 요청
      const res = await axiosInstance.post('/auth/forgot-password', {
        email,
      });
      console.log('forgot-password response:', res.data);
      const { message: serverMessage, token } = res.data;

      // 서버에서 온 메시지가 있으면 우선 표시
      if (serverMessage) {
        setMessage(serverMessage);
      }

      if (token) {
        // DEMO 버전: 메일 대신 토큰으로 바로 재설정 페이지 이동
        // /reset-password?token=... 로 이동하게 설계한 부분
        navigate(`/reset-password?token=${token}`);
      } else {
        // 가입 안 된 이메일이거나 토큰이 없는 경우
        setMessage('해당 이메일로 가입된 계정을 찾을 수 없습니다.');
      }
    } catch (error) {
      console.error('forgot-password error:', error);
      setMessage('요청 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="container auth-container">
        <div className="auth-card">
          <h2 className="auth-title">비밀번호 찾기</h2>
          <p className="auth-subtitle">
            가입하신 이메일을 입력해 주세요. 비밀번호 재설정 안내를 보내드립니다.
            {/* 실제 운영에서는 이메일로 링크를 보내고,
                지금 DEMO 환경에서는 바로 재설정 페이지로 이동한다고
                밑에 안내 문구 하나 추가해도 좋음 */}
          </p>

          {message && (
            <div className="alert alert-info py-2 auth-alert" role="alert">
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label auth-label">이메일</label>
              <input
                type="email"
                className="form-control auth-input"
                placeholder="example@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              className="btn btn-login-default w-100 auth-submit-btn"
              disabled={loading}
            >
              {loading ? '처리 중...' : '재설정 링크 보내기'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;
