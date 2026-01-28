import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <Navbar
      expand="lg"
      variant="dark"
      sticky="top"
      className="py-4"
      style={{ backgroundColor: '#171a33' }} // 푸터와 톤 통일
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
              to="/service"
              className="fw-semibold"
              style={{ fontSize: '1.1rem' }}
            >
              서비스 · 상품
            </Nav.Link>
          </Nav>

          {/* 인증 영역 */}
          <Nav className="text-center">
            <Nav.Link as={Link} to="/login">로그인</Nav.Link>
            <Nav.Link
              as={Link}
              to="/signup"
              className="fw-semibold text-warning"
            >
              회원가입
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;
