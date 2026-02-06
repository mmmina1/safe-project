import { NavLink, Outlet } from "react-router-dom";

const SIDEBAR_BG = "#272A3C";
const MAIN_BG = "#2C2F40";
const TEXT_WHITE = "#ffffff";
const TEXT_MUTED = "#9ca3af";
const BORDER = "#545763";
const ACTIVE_BG = "rgba(255,255,255,0.08)";

export default function OperatorLayout() {
  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        minHeight: "calc(100vh - 200px)",
        background: MAIN_BG,
        boxSizing: "border-box",
      }}
    >
      <aside
        className="operator-sidebar"
        style={{
          width: "240px",
          background: SIDEBAR_BG,
          padding: "36px 18px 18px 18px",
          borderRight: `1px solid ${BORDER}`,
          flexShrink: 0,
          position: "static",
          top: "auto",
          height: "auto",
          alignSelf: "flex-start",
        }}
      >
        <div style={{ color: TEXT_WHITE, fontSize: "18px", fontWeight: 800, marginBottom: "32px" }}>
          운영자 메뉴
        </div>
        <div style={{ marginTop: "0" }}>
          <NavLink to="/operator" end style={({ isActive }) => ({
            display: "block",
            padding: "10px 12px",
            marginBottom: "6px",
            borderRadius: "8px",
            textDecoration: "none",
            color: isActive ? TEXT_WHITE : TEXT_MUTED,
            background: isActive ? ACTIVE_BG : "transparent",
            fontWeight: 600,
          })}>
            대시보드
          </NavLink>
          <NavLink to="/operator/users" style={({ isActive }) => ({
            display: "block",
            padding: "10px 12px",
            marginBottom: "6px",
            borderRadius: "8px",
            textDecoration: "none",
            color: isActive ? TEXT_WHITE : TEXT_MUTED,
            background: isActive ? ACTIVE_BG : "transparent",
            fontWeight: 600,
          })}>
            회원 검색
          </NavLink>
          <NavLink to="/operator/cs" style={({ isActive }) => ({
            display: "block",
            padding: "10px 12px",
            marginBottom: "6px",
            borderRadius: "8px",
            textDecoration: "none",
            color: isActive ? TEXT_WHITE : TEXT_MUTED,
            background: isActive ? ACTIVE_BG : "transparent",
            fontWeight: 600,
          })}>
            고객지원 대시보드
          </NavLink>
          <NavLink to="/operator/products" style={({ isActive }) => ({
            display: "block",
            padding: "10px 12px",
            marginBottom: "6px",
            borderRadius: "8px",
            textDecoration: "none",
            color: isActive ? TEXT_WHITE : TEXT_MUTED,
            background: isActive ? ACTIVE_BG : "transparent",
            fontWeight: 600,
          })}>
            서비스 상품
          </NavLink>
          <NavLink to="/operator/community-reports" style={({ isActive }) => ({
            display: "block",
            padding: "10px 12px",
            marginBottom: "6px",
            borderRadius: "8px",
            textDecoration: "none",
            color: isActive ? TEXT_WHITE : TEXT_MUTED,
            background: isActive ? ACTIVE_BG : "transparent",
            fontWeight: 600,
          })}>
            신고 게시글 처리
          </NavLink>
          <NavLink to="/operator/blind-reasons" style={({ isActive }) => ({
            display: "block",
            padding: "10px 12px",
            marginBottom: "6px",
            borderRadius: "8px",
            textDecoration: "none",
            color: isActive ? TEXT_WHITE : TEXT_MUTED,
            background: isActive ? ACTIVE_BG : "transparent",
            fontWeight: 600,
          })}>
            블라인드 사유
          </NavLink>
          <NavLink to="/operator/notices" style={({ isActive }) => ({
            display: "block",
            padding: "10px 12px",
            marginBottom: "6px",
            borderRadius: "8px",
            textDecoration: "none",
            color: isActive ? TEXT_WHITE : TEXT_MUTED,
            background: isActive ? ACTIVE_BG : "transparent",
            fontWeight: 600,
          })}>
            공지사항
          </NavLink>
          <NavLink to="/operator/banners" style={({ isActive }) => ({
            display: "block",
            padding: "10px 12px",
            marginBottom: "6px",
            borderRadius: "8px",
            textDecoration: "none",
            color: isActive ? TEXT_WHITE : TEXT_MUTED,
            background: isActive ? ACTIVE_BG : "transparent",
            fontWeight: 600,
          })}>
            배너 관리
          </NavLink>
          <NavLink to="/operator/blacklist" style={({ isActive }) => ({
            display: "block",
            padding: "10px 12px",
            marginBottom: "6px",
            borderRadius: "8px",
            textDecoration: "none",
            color: isActive ? TEXT_WHITE : TEXT_MUTED,
            background: isActive ? ACTIVE_BG : "transparent",
            fontWeight: 600,
          })}>
            블랙리스트
          </NavLink>
        </div>
      </aside>
      <main style={{ flex: 1, padding: "40px 48px", background: MAIN_BG, color: TEXT_WHITE }}>
        <Outlet />
      </main>
    </div>
  );
}
