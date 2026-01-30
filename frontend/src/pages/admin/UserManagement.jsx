import React, { useState } from 'react';
import './UserManagement.css';

function UserManagement() {
  const [activeTab, setActiveTab] = useState('users');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // --- 더미 데이터 ---
  const users = [
    { id: 'user_1024', email: 'user1024@example.com', status: 'NORMAL', riskScore: 12 },
    { id: 'user_775', email: 'danger775@example.com', status: 'WARNING', riskScore: 48 },
    { id: 'user_331', email: 'test331@example.com', status: 'NORMAL', riskScore: 7 },
    { id: 'user_209', email: 'block209@example.com', status: 'BLOCKED', riskScore: 82 },
  ];

  const logs = [
    { id: 1, time: '2026-01-30 09:30', admin: 'admin01', action: 'WARNING', target: 'user_775', reason: '비정상적 대량 접근' },
    { id: 2, time: '2026-01-30 08:55', admin: 'admin01', action: 'BLOCK', target: 'user_209', reason: '스미싱 의심 도메인 배포' },
    { id: 3, time: '2026-01-29 18:10', admin: 'admin02', action: 'UNBLOCK', target: 'user_120', reason: '오탐 소명 완료' },
  ];

  // 상세 모달 열기
  const handleOpenModal = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  // 모달 닫기
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  return (
    <div className="user-management">
      <h1 className="admin-title">사용자 · 운영 관리</h1>
      <p className="admin-subtitle">사용자 상태 및 관리자 조치 이력을 확인할 수 있습니다.</p>

      {/* 탭 버튼 영역 */}
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

      {/* 컨텐츠 영역 */}
      <section className="admin-card">
        {activeTab === 'users' ? (
          <table className="admin-table">
            <thead>
              <tr>
                <th>사용자 ID</th>
                <th>상태</th>
                <th>위험 점수</th>
                <th>액션</th>
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
                  <td className={user.riskScore > 60 ? 'high-risk' : ''}>
                    {user.riskScore}점
                  </td>
                  <td>
                    <button className="btn-admin-action" onClick={() => handleOpenModal(user)}>
                      조치하기
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>시간</th>
                <th>대상</th>
                <th>조치</th>
                <th>관리자</th>
                <th>사유</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id}>
                  <td>{log.time}</td>
                  <td>{log.target}</td>
                  <td><span className={`action-text ${log.action}`}>{log.action}</span></td>
                  <td>{log.admin}</td>
                  <td className="reason-col">{log.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {/* 조치 팝업 모달 */}
      {isModalOpen && selectedUser && (
        <div className="modal-backdrop" onClick={handleCloseModal}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>운영 조치 적용</h2>
              <button className="close-x" onClick={handleCloseModal}>&times;</button>
            </div>
            
            <div className="modal-body">
              <div className="info-row">
                <span>대상 사용자:</span>
                <strong>{selectedUser.id} ({selectedUser.email})</strong>
              </div>
              
              <div className="input-group">
                <label>조치 유형</label>
                <select className="modal-select">
                  <option value="NORMAL">정상(해제)</option>
                  <option value="WARNING">주의(경고)</option>
                  <option value="BLOCKED">영구 정지</option>
                </select>
              </div>

              <div className="input-group">
                <label>조치 사유</label>
                <textarea 
                  className="modal-textarea" 
                  placeholder="관리자 코멘트를 입력하세요 (기능 제한 근거 등)"
                ></textarea>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-secondary" onClick={handleCloseModal}>취소</button>
              <button className="btn-primary" onClick={() => {
                alert('조치가 정상적으로 적용되었습니다.');
                handleCloseModal();
              }}>
                적용하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserManagement;