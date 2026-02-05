import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <Navbar
      expand="lg"
      variant="dark"
      style={{ 
        backgroundColor: '#171a33',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        width: '100%',
        maxWidth: '100vw',
        boxSizing: 'border-box',
        paddingTop: '1.25rem',
        paddingBottom: '1.25rem',
        minHeight: '90px',
        height: 'auto',
        display: 'flex',
        alignItems: 'center',
        overflow: 'visible'
      }} // 푸터와 톤 통일
    >
      <Container fluid>
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
              style={{ 
                fontSize: '1.1rem',
                lineHeight: '1.5',
                padding: '0.5rem 0.75rem',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              관제
            </Nav.Link>

            <Nav.Link
              as={Link}
              to="/ai"
              className="fw-semibold"
              style={{ 
                fontSize: '1.1rem',
                lineHeight: '1.5',
                padding: '0.5rem 0.75rem',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              AI 서비스
            </Nav.Link>

            <Nav.Link
              as={Link}
              to="/community"
              className="fw-semibold"
              style={{ 
                fontSize: '1.1rem',
                lineHeight: '1.5',
                padding: '0.5rem 0.75rem',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              커뮤니티
            </Nav.Link>

            <Nav.Link
              as={Link}
              to="/service"
              className="fw-semibold"
              style={{ 
                fontSize: '1.1rem',
                lineHeight: '1.5',
                padding: '0.5rem 0.75rem',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              서비스 · 상품
            </Nav.Link>

            <Nav.Link
              as={Link}
              to="/operator"
              className="fw-semibold"
              style={{ 
                fontSize: '1.1rem',
                lineHeight: '1.5',
                padding: '0.5rem 0.75rem',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              운영자
            </Nav.Link>
          </Nav>

          {/* 인증 영역 */}
          <Nav className="text-center">
            
            <Nav.Link 
              as={Link} 
              to="/login"
              style={{
                lineHeight: '1.5',
                padding: '0.5rem 0.75rem',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              로그인
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/signup"
              className="fw-semibold text-warning"
              style={{
                lineHeight: '1.5',
                padding: '0.5rem 0.75rem',
                display: 'flex',
                alignItems: 'center'
              }}
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