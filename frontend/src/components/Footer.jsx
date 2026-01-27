import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

function Footer() {
  return (
    // container-fluid를 사용하거나, footer 자체에 bg를 주어 가로를 꽉 채웁니다.
    <footer className="bg-dark text-light py-5" style={{ width: '100%', marginTop: 'auto' }}>
      <Container fluid="lg"> {/* lg 사이즈까지는 적절한 여백을 유지하며 넓게 퍼집니다 */}
        <Row className="gy-4 align-items-center">
          {/* 회사 정보 */}
          <Col lg={4} md={12} className="text-center text-lg-start">
            <h5 className="fw-bold mb-3" style={{ letterSpacing: '1px' }}>SAFE SHOP</h5>
            <div className="small opacity-75">
              <p className="mb-1">대표자: 이민영 | 사업자번호: 123-45-67890</p>
              <p className="mb-0 text-truncate">주소: 경기도 수원시 팔달구 ...</p>
            </div>
          </Col>
          
          {/* 고객 센터 */}
          <Col lg={4} md={12} className="text-center border-lg-start border-lg-end border-secondary">
            <h5 className="fw-bold mb-2">CS CENTER</h5>
            <p className="display-6 fw-bold mb-1 text-warning">1588-0000</p>
            <p className="small opacity-50 mb-0">평일 09:00 ~ 18:00 (주말/공휴일 휴무)</p>
          </Col>

          {/* 링크 및 저작권 */}
          <Col lg={4} md={12} className="text-center text-lg-end">
            <div className="mb-3">
              <a href="#terms" className="text-light text-decoration-none small mx-2 opacity-75 hover-opacity-100">이용약관</a>
              <span className="opacity-25">|</span>
              <a href="#privacy" className="text-light text-decoration-none small mx-2 opacity-75 hover-opacity-100">개인정보처리방침</a>
            </div>
            <p className="small opacity-50 mb-0">
              &copy; 2026 <strong>SAFE SHOP</strong>. All rights reserved.
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}

export default Footer;