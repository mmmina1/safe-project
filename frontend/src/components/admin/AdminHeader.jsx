// src/components/admin/AdminHeader.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import '../common/UserAuthNav'; // 타입 미스 방지용이 아니라, 아래에서 실제 import 필요
import UserAuthNav from '../common/UserAuthNav';
import './AdminHeader.css';


function AdminHeader() {
  const role = localStorage.getItem('role');
  return (
    <header className="admin-header">
      {/* 왼쪽 로고 영역 */}
      <div className="admin-logo">RISK WATCH · ADMIN</div>

      {/* 가운데 네비게이션 영역 */}
      <nav className="admin-nav-wrap">
        <NavLink to="/admin" end className="admin-nav">
          대시보드
        </NavLink>
        <NavLink to="/admin/manage" className="admin-nav">
          사용자 관리
        </NavLink>
        <NavLink to="/admin/policy" className="admin-nav">
          데이터 기준
        </NavLink>
        {role === 'ADMIN' && (
          <NavLink to="/operator" className="admin-nav admin-nav-operator">
            운영자 페이지
          </NavLink>
        )}
      </nav>

      {/* 오른쪽: 메인과 동일한 사용자 이름 + 로그아웃 메뉴 */}
      <div className="admin-user-wrap">
        <UserAuthNav />
      </div>
    </header>
  );
}

export default AdminHeader;
