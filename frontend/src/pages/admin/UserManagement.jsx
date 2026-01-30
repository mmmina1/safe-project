// src/pages/admin/UserManagement.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './UserManagement.css';

function UserManagement() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('users');

  // 더미 데이터
  const users = [
    { id: 'user_1024', status: 'NORMAL', riskScore: 12 },
    { id: 'user_775', status: 'WARNING', riskScore: 48 },
    { id: 'user_331', status: 'NORMAL', riskScore: 7 },
    { id: 'user_209', status: 'BLOCKED', riskScore: 82 },
  ];

  const logs = [
    { id: 1, time: '09:30', admin: 'admin01', action: 'WARNING', target: 'user_775' },
    { id: 2, time: '08:55', admin: 'admin01', action: 'BLOCK', target: 'user_209' },
    { id: 3, time: '08:10', admin: 'admin02', action: 'UNBLOCK', target: 'user_120' },
  ];

  return (
    <div className="user-management">
      <h1 className="admin-title">사용자 · 운영 관리</h1>
      <p className="admin-subtitle">
        사용자 상태 및 관리자 조치 이력을 확인할 수 있습니다.
      </p>

      {/* 탭 */}
      <div className="admin-tabs">
        <button
          className={`admin-tab ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          회원 목록
        </button>
        <button
          className={`admin-tab ${activeTab === 'logs' ? 'active' : ''}`}
          onClick={() => setActiveTab('logs')}
        >
          운영 이력
        </button>
      </div>

      {/* 회원 목록 */}
      {activeTab === 'users' && (
        <section className="admin-card">
          <table className="admin-table">
            <thead>
              <tr>
                <th>사용자 ID</th>
                <th>상태</th>
                <th>위험 점수</th>
                <th>상세</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>
                    <span className={`badge badge-${user.status.toLowerCase()}`}>
                      {user.status}
                    </span>
                  </td>
                  <td>{user.riskScore}</td>
                  <td>
                    <button
                      className="btn-admin"
                      onClick={() => navigate(`/admin/users/${user.id}`)}
                    >
                      보기
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      {/* 운영 이력 */}
      {activeTab === 'logs' && (
        <section className="admin-card">
          <table className="admin-table">
            <thead>
              <tr>
                <th>시간</th>
                <th>관리자</th>
                <th>조치</th>
                <th>대상</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id}>
                  <td>{log.time}</td>
                  <td>{log.admin}</td>
                  <td>{log.action}</td>
                  <td>{log.target}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}
    </div>
  );
}

export default UserManagement;