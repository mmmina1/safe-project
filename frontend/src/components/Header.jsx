// src/components/Header.jsx
import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import UserAuthNav from './common/UserAuthNav';

function Header() {
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
          className="d-flex align-items-center"
          style={{
            color: '#BFC3C7',
            fontSize: '1.7rem',
            fontWeight: 600,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            textShadow: '0 1px 2px rgba(0,0,0,0.6)'
          }}
        >
          <img
            src="/logo-riskWatch.png"
            alt="Risk Watch Logo"
            width="32"
            height="32"
            className="me-2"
          />
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

          {/* 오른쪽 인증 영역 (공통 컴포넌트) */}
          <UserAuthNav />
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;