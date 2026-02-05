// src/components/Header.jsx
import React, { useEffect, useState } from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';

function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const name = localStorage.getItem('userName');

    setIsLoggedIn(!!token);
    setUserName(name || '');
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userName');
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
          <Nav className="mx-auto gap-lg-5 text-center">
            <Nav.Link as={Link} to="/monitoring">관제</Nav.Link>
            <Nav.Link as={Link} to="/ai">AI 서비스</Nav.Link>
            <Nav.Link as={Link} to="/community">커뮤니티</Nav.Link>
            <Nav.Link as={Link} to="/product">서비스 · 상품</Nav.Link>
          </Nav>

          <Nav className="align-items-center">
            {isLoggedIn ? (
              <>
                {userName && (
                  <Nav.Link disabled className="fw-semibold me-2">
                    {userName} 님
                  </Nav.Link>
                )}
                <Nav.Link as={Link} to="/mypage">마이페이지</Nav.Link>
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
                <Nav.Link as={Link} to="/login">로그인</Nav.Link>
                <Nav.Link as={Link} to="/signup" className="fw-semibold text-warning">
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
