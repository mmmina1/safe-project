// src/components/Header.jsx
import React, { useEffect, useState } from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';

function Header() {
  // 로그인 여부 상태
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // 로그인한 유저 이름
  const [userName, setUserName] = useState('');

  const location = useLocation();
  const navigate = useNavigate();

  // 라우트(path)가 바뀔 때마다 토큰/이름 다시 확인
  useEffect(() => {
    const token = localStorage.getItem('accessToken'); // LoginPage에서 저장한 키와 같아야 함
    const name = localStorage.getItem('userName');     // LoginPage에서 저장한 키와 같아야 함

    setIsLoggedIn(!!token);
    setUserName(name || '');

    // 디버깅용
    console.log('Header: token =', token, 'isLoggedIn =', !!token, 'userName =', name);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userName');
    setIsLoggedIn(false);
    setUserName('');
    navigate('/');
  };

  return (
    <Navbar
      expand="lg"
      variant="dark"
      sticky="top"
      className="py-4"
      style={{ backgroundColor: '#171a33' }}
    >
      <Container fluid="lg">
        {/* 로고 / 서비스명 */}
        <Navbar.Brand
          as={Link}
          to="/"
          style={{
            fontSize: '1.7rem',
            fontWeight: 600,
            letterSpacing: '0.08em',
            textTransform: 'uppercase'
          }}
        >
          Risk Watch
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="main-navbar" />
        <Navbar.Collapse id="main-navbar">
          {/* 메인 기능 메뉴 */}
          <Nav className="mx-auto gap-lg-5 text-center">
            <Nav.Link
              as={Link}
              to="/monitoring"
              className="fw-semibold"
              style={{ fontSize: '1.1rem' }}
            >
              관제
            </Nav.Link>

            <Nav.Link
              as={Link}
              to="/ai"
              className="fw-semibold"
              style={{ fontSize: '1.1rem' }}
            >
              AI 서비스
            </Nav.Link>

            <Nav.Link
              as={Link}
              to="/community"
              className="fw-semibold"
              style={{ fontSize: '1.1rem' }}
            >
              커뮤니티
            </Nav.Link>

            <Nav.Link
              as={Link}
              to="/product"
              className="fw-semibold"
              style={{ fontSize: '1.1rem' }}
            >
              서비스 · 상품
            </Nav.Link>
          </Nav>

          {/* 인증 영역 */}
          <Nav className="text-center align-items-center">
            {isLoggedIn ? (
              <>
                {/* 로그인 유저 이름 표시 */}
                {userName && (
                  <Nav.Link disabled className="fw-semibold me-2">
                    {userName} 님
                  </Nav.Link>
                )}

                <Nav.Link
                  as={Link}
                  to="/mypage"
                  className="fw-semibold"
                >
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
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;
