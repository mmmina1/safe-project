import './Header.css';

function Header() {
  return (
    <header className="header">
      {/* 왼쪽: 로고 */}
      <div className="header-left">
        <span className="logo-icon">🛡️</span>
        <span className="logo-text">Risk Watch</span>
      </div>

      {/* 가운데: 검색 */}
      <div className="header-center">
        <input
          type="text"
          placeholder="번호 또는 URL 위험도 검색"
        />
      </div>

      {/* 오른쪽: 알림 / 유저 */}
      <div className="header-right">
        <span className="icon">🔔</span>
        <span className="icon">👤</span>
      </div>
    </header>
  );
}

export default Header;
