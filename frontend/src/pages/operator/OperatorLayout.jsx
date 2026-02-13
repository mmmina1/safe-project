import { NavLink, Outlet } from "react-router-dom";

const MAIN_BG = "#2C2F40";
const TEXT_WHITE = "#ffffff";
const TEXT_MUTED = "#9ca3af";
const BORDER = "#545763";
const ACTIVE_BG = "rgba(255,255,255,0.08)";
const NAV_BG = "#272A3C";

export default function OperatorLayout() {
  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        minHeight: "calc(100vh - 76px)",
        background: MAIN_BG,
        boxSizing: "border-box",
        marginTop: "76px", // 헤더 높이만큼 아래로
      }}
    >
      {/* 왼쪽 사이드바 */}
      <aside
        style={{
          width: "220px",
          background: NAV_BG,
          borderRight: `1px solid ${BORDER}`,
          padding: "24px 0",
          boxSizing: "border-box",
          flexShrink: 0,
        }}
      >
        <div style={{ 
          padding: "20px 16px 20px 16px",
          borderBottom: `1px solid ${BORDER}`,
          marginBottom: "16px",
        }}>
          <div style={{ color: TEXT_WHITE, fontSize: "16px", fontWeight: 800 }}>
            운영자 메뉴
          </div>
        </div>
        <nav style={{ 
          display: "flex",
          flexDirection: "column",
          gap: "4px",
          padding: "0 8px",
        }}>
          <NavLink to="/operator" end style={({ isActive }) => ({
            display: "block",
            padding: "10px 12px",
            textDecoration: "none",
            color: isActive ? TEXT_WHITE : TEXT_MUTED,
            background: isActive ? ACTIVE_BG : "transparent",
            fontWeight: isActive ? 600 : 500,
            fontSize: "0.875rem",
            borderRadius: "6px",
            borderLeft: isActive ? `3px solid ${TEXT_WHITE}` : "3px solid transparent",
            transition: "all 0.2s ease",
          })}>
            대시보드
          </NavLink>
          <NavLink to="/operator/users" style={({ isActive }) => ({
            display: "block",
            padding: "10px 12px",
            textDecoration: "none",
            color: isActive ? TEXT_WHITE : TEXT_MUTED,
            background: isActive ? ACTIVE_BG : "transparent",
            fontWeight: isActive ? 600 : 500,
            fontSize: "0.875rem",
            borderRadius: "6px",
            borderLeft: isActive ? `3px solid ${TEXT_WHITE}` : "3px solid transparent",
            transition: "all 0.2s ease",
          })}>
            회원 검색
          </NavLink>
          <NavLink to="/operator/cs" style={({ isActive }) => ({
            display: "block",
            padding: "10px 12px",
            textDecoration: "none",
            color: isActive ? TEXT_WHITE : TEXT_MUTED,
            background: isActive ? ACTIVE_BG : "transparent",
            fontWeight: isActive ? 600 : 500,
            fontSize: "0.875rem",
            borderRadius: "6px",
            borderLeft: isActive ? `3px solid ${TEXT_WHITE}` : "3px solid transparent",
            transition: "all 0.2s ease",
          })}>
            고객지원 대시보드
          </NavLink>
          <NavLink to="/operator/products" style={({ isActive }) => ({
            display: "block",
            padding: "10px 12px",
            textDecoration: "none",
            color: isActive ? TEXT_WHITE : TEXT_MUTED,
            background: isActive ? ACTIVE_BG : "transparent",
            fontWeight: isActive ? 600 : 500,
            fontSize: "0.875rem",
            borderRadius: "6px",
            borderLeft: isActive ? `3px solid ${TEXT_WHITE}` : "3px solid transparent",
            transition: "all 0.2s ease",
          })}>
            서비스 상품
          </NavLink>
          <NavLink to="/operator/community-reports" style={({ isActive }) => ({
            display: "block",
            padding: "10px 12px",
            textDecoration: "none",
            color: isActive ? TEXT_WHITE : TEXT_MUTED,
            background: isActive ? ACTIVE_BG : "transparent",
            fontWeight: isActive ? 600 : 500,
            fontSize: "0.875rem",
            borderRadius: "6px",
            borderLeft: isActive ? `3px solid ${TEXT_WHITE}` : "3px solid transparent",
            transition: "all 0.2s ease",
          })}>
            신고 게시글 처리
          </NavLink>
          <NavLink to="/operator/blind-reasons" style={({ isActive }) => ({
            display: "block",
            padding: "10px 12px",
            textDecoration: "none",
            color: isActive ? TEXT_WHITE : TEXT_MUTED,
            background: isActive ? ACTIVE_BG : "transparent",
            fontWeight: isActive ? 600 : 500,
            fontSize: "0.875rem",
            borderRadius: "6px",
            borderLeft: isActive ? `3px solid ${TEXT_WHITE}` : "3px solid transparent",
            transition: "all 0.2s ease",
          })}>
            블라인드 사유
          </NavLink>
          <NavLink to="/operator/notices" style={({ isActive }) => ({
            display: "block",
            padding: "10px 12px",
            textDecoration: "none",
            color: isActive ? TEXT_WHITE : TEXT_MUTED,
            background: isActive ? ACTIVE_BG : "transparent",
            fontWeight: isActive ? 600 : 500,
            fontSize: "0.875rem",
            borderRadius: "6px",
            borderLeft: isActive ? `3px solid ${TEXT_WHITE}` : "3px solid transparent",
            transition: "all 0.2s ease",
          })}>
            공지사항
          </NavLink>
          <NavLink to="/operator/banners" style={({ isActive }) => ({
            display: "block",
            padding: "10px 12px",
            textDecoration: "none",
            color: isActive ? TEXT_WHITE : TEXT_MUTED,
            background: isActive ? ACTIVE_BG : "transparent",
            fontWeight: isActive ? 600 : 500,
            fontSize: "0.875rem",
            borderRadius: "6px",
            borderLeft: isActive ? `3px solid ${TEXT_WHITE}` : "3px solid transparent",
            transition: "all 0.2s ease",
          })}>
            배너 관리
          </NavLink>
          <NavLink to="/operator/blacklist" style={({ isActive }) => ({
            display: "block",
            padding: "10px 12px",
            textDecoration: "none",
            color: isActive ? TEXT_WHITE : TEXT_MUTED,
            background: isActive ? ACTIVE_BG : "transparent",
            fontWeight: isActive ? 600 : 500,
            fontSize: "0.875rem",
            borderRadius: "6px",
            borderLeft: isActive ? `3px solid ${TEXT_WHITE}` : "3px solid transparent",
            transition: "all 0.2s ease",
          })}>
            블랙리스트
          </NavLink>
        </nav>
      </aside>
      {/* 메인 콘텐츠 영역 */}
      <main style={{ 
        flex: 1, 
        padding: "40px 32px 32px 24px", 
        background: MAIN_BG, 
        color: TEXT_WHITE, 
        overflowX: "visible",
        overflowY: "visible",
        boxSizing: "border-box",
        minHeight: 0,
        minWidth: 0,
      }}>
        <Outlet />
      </main>
    </div>
  );
}
