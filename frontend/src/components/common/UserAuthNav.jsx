// src/components/common/UserAuthNav.jsx
import React, { useEffect, useState } from 'react';
import { Nav } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';

function UserAuthNav() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');

  const location = useLocation();
  const navigate = useNavigate();

  // 라우트(path)가 바뀔 때마다 토큰/이름 다시 확인
  useEffect(() => {
    const token = localStorage.getItem('accessToken'); // LoginPage/KakaoCallbackPage에서 저장한 키
    const name = localStorage.getItem('userName');

    setIsLoggedIn(!!token);
    setUserName(name || '');

    // 디버깅용
    console.log(
      'UserAuthNav: token =',
      token,
      'isLoggedIn =',
      !!token,
      'userName =',
      name
    );
  }, [location]);

  // ✅ 로그아웃 (카카오 계정까지 서버에서 처리 + 메인으로 이동)
  const handleLogout = async () => {
    const provider = localStorage.getItem('loginProvider'); // 'KAKAO' / 'GOOGLE' / 'LOCAL' 등
    const kakaoAccessToken = localStorage.getItem('kakaoAccessToken');
    const ourToken = localStorage.getItem('accessToken'); // 우리 서비스 JWT

    try {
      // 카카오 로그인 유저인 경우에만 카카오 로그아웃 API 호출
      if (provider === 'KAKAO' && kakaoAccessToken) {
        await fetch('http://localhost:8080/api/auth/kakao/logout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(ourToken ? { Authorization: `Bearer ${ourToken}` } : {}),
          },
          body: JSON.stringify({ accessToken: kakaoAccessToken }),
        });
      }
    } catch (e) {
      console.error('카카오 로그아웃 호출 중 오류', e);
      // 실패해도 프론트 세션은 끊어줄 거라 여기서 막 터뜨리지는 않음
    } finally {
      // 프론트 세션/스토리지 정리
      localStorage.removeItem('accessToken');
      localStorage.removeItem('userName');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('loginProvider');
      localStorage.removeItem('kakaoAccessToken');

      setIsLoggedIn(false);
      setUserName('');

      // ✅ 항상 메인 페이지로 이동
      navigate('/');
    }
  };

  return (
    <Nav className="text-center align-items-center">
      {isLoggedIn ? (
        <>
          {/* 로그인 유저 이름 표시 */}
          {userName && (
            <span className="fw-semibold me-2 text-white">
              {userName} 님
           </span>
          )}

          <Nav.Link as={Link} to="/mypage" className="fw-semibold">
            마이페이지
          </Nav.Link>
          <Nav.Link
            onClick={handleLogout}
            className="fw-semibold text-warning"
            style={{ cursor: 'pointer' }}
          >
            로그아웃
          </Nav.Link>
        </>
      ) : (
        <>
          <Nav.Link as={Link} to="/login">
            로그인
          </Nav.Link>
          <Nav.Link
            as={Link}
            to="/signup"
            className="fw-semibold text-warning"
          >
            회원가입
          </Nav.Link>
        </>
      )}
    </Nav>
  );
}

export default UserAuthNav;
