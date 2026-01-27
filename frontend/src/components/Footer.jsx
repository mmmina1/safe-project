import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

function Footer() {
  return (
    <footer className="bg-dark text-light py-4 mt-5">
      <Container>
        <Row>
          {/* 회사 정보 */}
          <Col md={4} className="mb-3">
            <h5>(주) SAFE SHOP</h5>
            <p className="small">대표자: 이민영 | 사업자번호: 123-45-67890</p>
            <p className="small">주소: 경기도 수원시 팔달구 ...</p>
          </Col>
          
          {/* 고객 센터 */}
          <Col md={4} className="mb-3">
            <h5>CS CENTER</h5>
            <p className="mb-0">1588-0000</p>
            <p className="small text-secondary">평일 09:00 ~ 18:00 (주말/공휴일 휴무)</p>
          </Col>

          {/* 링크 및 저작권 */}
          <Col md={4} className="text-md-end">
            <p className="small">이용약관 | 개인정보처리방침</p>
            <p className="small text-secondary">
              &copy; 2026 SAFE SHOP. All rights reserved.
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}

export default Footer;

