import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <Navbar
      expand="lg"
      variant="dark"
      className="app-header"
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
          {/* 메인 메뉴 */}
          <Nav className="mx-auto gap-lg-5 text-center">
            <Nav.Link as={Link} to="/monitoring" className="fw-semibold">
              관제
            </Nav.Link>
            <Nav.Link as={Link} to="/ai" className="fw-semibold">
              AI 서비스
            </Nav.Link>
            <Nav.Link as={Link} to="/community" className="fw-semibold">
              커뮤니티
            </Nav.Link>
            <Nav.Link as={Link} to="/service" className="fw-semibold">
              서비스 · 상품
            </Nav.Link>
          </Nav>

          {/* 인증 영역 */}
          <Nav className="text-center">
            <Nav.Link as={Link} to="/login">로그인</Nav.Link>
            <Nav.Link as={Link} to="/signup" className="fw-semibold text-warning">
              회원가입
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;