// src/components/admin/AdminHeader.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import './AdminHeader.css';

function AdminHeader() {
  return (
    <header className="admin-header">
      <div className="admin-logo">RISK WATCH · ADMIN</div>

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
      </nav>
    </header>
  );
}

export default AdminHeader;