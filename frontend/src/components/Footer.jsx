import React from 'react';
import { FaGithub, FaEnvelope, FaShieldAlt, FaMapMarkerAlt } from 'react-icons/fa';

function Footer() {
  // 열린 팝업창들을 저장
  const popupRefs = React.useRef({});

  const openPopup = (url, name) => {
    const offset = (window.popupCount || 0) * 50;
    window.popupCount = ((window.popupCount || 0) + 1) % 10;
    
    const left = 100 + offset;
    const top = 100 + offset;
    
    // 새 창 열기
    const newWindow = window.open(
      url, 
      name, 
      `width=800,height=600,left=${left},top=${top},scrollbars=yes,resizable=yes`
    );
    
    // 참조 저장
    popupRefs.current[name] = newWindow;
    
    // 모든 열린 창들을 순차적으로 앞으로 가져오기
    setTimeout(() => {
      Object.values(popupRefs.current).forEach(popup => {
        if (popup && !popup.closed) {
          popup.focus();
        }
      });
      if (newWindow && !newWindow.closed) {
        newWindow.focus();
      }
    }, 100);
  };

  return (
    <footer 
      style={{ 
        backgroundColor: '#1a1d2e', 
        padding: '15px 60px',
        borderTop: '1px solid rgba(255,255,255,0.1)',
        color: '#ffffff',
        width: '100%',
        boxSizing: 'border-box'
      }}
    >
      <div style={{ 
        maxWidth: '1400px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        gap: '40px',
        alignItems: 'center'
      }}>
        
        {/* 왼쪽: 브랜드 */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
            <FaShieldAlt style={{ color: '#ffc107', marginRight: '12px' }} size="36" />
            <span style={{ fontWeight: 'bold', fontSize: '1.8rem', color: '#ffffff' }}>Risk Watch</span>
          </div>
          <p style={{ fontSize: '0.7rem', color: '#0dcaf0', margin: 0, lineHeight: '1.3' }}>
            스미싱으로부터 안전한 일상, Team SAFE가 만듭니다.
          </p>
        </div>
        
        {/* 중앙: Contact Us */}
        <div style={{ textAlign: 'center' }}>
          <h3 style={{ fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '8px', color: '#ffffff' }}>
            CONTACT US
          </h3>
          <div style={{ display: 'flex', gap: '12px', marginBottom: '6px', justifyContent: 'center', alignItems: 'center' }}>
            <a 
              href="https://github.com/mmmina1/safe-project/tree/develop" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ color: '#adb5bd' }}
            >
              <FaGithub size="18" />
            </a>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <FaEnvelope size="16" color="#adb5bd" />
              <span style={{ color: '#adb5bd', fontSize: '0.7rem' }}>chlalsdk5743@gmail.com</span>
            </div>
          </div>
          <p style={{ fontSize: '0.7rem', color: '#adb5bd', margin: '3px 0', lineHeight: '1.4' }}>
            CS: 1588-0000 (평일 09:00 ~ 18:00)
          </p>
          <p style={{ fontSize: '0.7rem', color: '#adb5bd', margin: '3px 0', lineHeight: '1.4' }}>
            경기도 수원시 팔달구 중부대로 100 3층, 4층
          </p>
        </div>

        {/* 오른쪽: 법적 정보 */}
        <div style={{ textAlign: 'right' }}>
          <div style={{ marginBottom: '5px' }}>
            <a 
              href="#" 
              onClick={(e) => { e.preventDefault(); openPopup('/terms', 'termsWindow'); }}
              style={{ 
                color: '#ffffff', 
                textDecoration: 'none', 
                fontSize: '0.75rem', 
                cursor: 'pointer', 
                marginLeft: '15px',
                fontWeight: '500'
              }}
            >
              이용약관
            </a>
            <a 
              href="#" 
              onClick={(e) => { e.preventDefault(); openPopup('/privacy', 'privacyWindow'); }}
              style={{ 
                color: '#ffffff', 
                textDecoration: 'none', 
                fontSize: '0.75rem', 
                cursor: 'pointer', 
                marginLeft: '15px',
                fontWeight: 'bold'
              }}
            >
              개인정보처리방침
            </a>
          </div>
          <p style={{ 
            fontSize: '0.65rem', 
            color: '#adb5bd', 
            margin: '0 0 3px 0', 
            lineHeight: '1.4',
            opacity: 0.9
          }}>
            본 플랫폼은 분석 결과를 제공할 뿐,<br />
            최종 판단과 책임은 사용자에게 있습니다.
          </p>
          <p style={{ 
            fontSize: '0.65rem', 
            color: '#adb5bd', 
            margin: 0,
            lineHeight: '1.3'
          }}>
            © 2026 Team SAFE. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;