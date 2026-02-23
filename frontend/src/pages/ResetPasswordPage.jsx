// src/pages/ResetPasswordPage.jsx (경로는 프로젝트 구조에 맞게)

import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance'; // 경로는 프로젝트 기준에 맞게 수정

function ResetPasswordPage() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState(null);
  const [tokenValid, setTokenValid] = useState(true);
  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  // URL 에서 token 추출
  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setTokenValid(false);
      setMessage('유효하지 않은 접근입니다. 비밀번호 재설정 링크를 다시 요청해 주세요.');
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    if (!tokenValid) return;

    if (!newPassword || !confirmPassword) {
      setMessage('새 비밀번호를 모두 입력해 주세요.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage('새 비밀번호와 확인 비밀번호가 일치하지 않습니다.');
      return;
    }

    if (newPassword.length < 8) {
      setMessage('비밀번호는 8자 이상으로 설정해 주세요.');
      return;
    }

    try {
      setLoading(true);

      await axiosInstance.post('/auth/reset-password', {
        token,
        newPassword,
      });

      setMessage('비밀번호가 변경되었습니다. 로그인 페이지로 이동합니다.');
      // 1~1.5초 정도 후에 로그인 페이지로 이동
      setTimeout(() => {
        navigate('/login');
      }, 1200);
    } catch (error) {
      console.error('reset-password error:', error);

      if (error.response?.data?.message) {
        setMessage(error.response.data.message);
      } else {
        setMessage('비밀번호 변경 중 오류가 발생했습니다. 링크가 만료되었을 수 있습니다.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="container auth-container">
        <div className="auth-card">
          <h2 className="auth-title">비밀번호 재설정</h2>
          <p className="auth-subtitle">
            새로 사용할 비밀번호를 입력해 주세요.
          </p>

          {message && (
            <div className="alert alert-info py-2 auth-alert" role="alert">
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label auth-label">새 비밀번호</label>
              <input
                type="password"
                className="form-control auth-input"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                disabled={loading || !tokenValid}
              />
            </div>

            <div className="mb-3">
              <label className="form-label auth-label">새 비밀번호 확인</label>
              <input
                type="password"
                className="form-control auth-input"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={loading || !tokenValid}
              />
            </div>

            <button
              type="submit"
              className="btn btn-login-default w-100 auth-submit-btn"
              disabled={loading || !tokenValid}
            >
              {loading ? '변경 중...' : '비밀번호 변경'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ResetPasswordPage;
