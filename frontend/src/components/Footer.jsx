import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

function Footer() {
  return (
    <footer 
      className="text-light py-4" 
      style={{ 
        backgroundColor: '#171a33', // 신뢰감을 주는 다크 네이비 색상
        width: '100%', 
        marginTop: 'auto' 
      }}
    >
      <Container fluid="lg">
        <Row className="gy-3 align-items-center">
          {/* 회사 정보 */}
          <Col lg={4} md={12} className="text-center text-lg-start">
            <h6 className="fw-bold mb-2">SAFE SHOP</h6>
            <div className="x-small opacity-75" style={{ fontSize: '0.85rem' }}>
              <p className="mb-1">대표자: 세이프 | 사업자번호: 123-45-67890</p>
              <p className="mb-0">주소: 경기도 수원시 팔달구</p>
            </div>
          </Col>
          
          {/* 고객 센터 */}
          <Col lg={4} md={12} className="text-center">
            <h6 className="fw-bold mb-1">CS CENTER</h6>
            <p className="fs-4 fw-bold mb-0 text-warning">1588-0000</p>
            <p className="x-small opacity-50" style={{ fontSize: '0.75rem' }}>
              평일 09:00 ~ 18:00 (주말/공휴일 휴무)
            </p>
          </Col>

          {/* 링크 및 저작권 */}
          <Col lg={4} md={12} className="text-center text-lg-end">
            <div className="mb-2">
              <a href="#terms" className="text-light text-decoration-none small mx-2 opacity-75">이용약관</a>
              <span className="opacity-25">|</span>
              <a href="#privacy" className="text-light text-decoration-none small mx-2 opacity-75">개인정보처리방침</a>
            </div>
            <p className="x-small opacity-50 mb-0" style={{ fontSize: '0.75rem' }}>
              &copy; 2026 <strong>SAFE SHOP</strong>. All rights reserved.
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}

export default Footer;