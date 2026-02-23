// src/pages/admin/operator/UserManagement.jsx

import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosInstance';
import './UserManagement.css';

// StateType(enum) → 라벨 매핑
const STATE_TYPE_LABEL = {
  WARNING: '주의(경고)',
  SUSPENDED: '정지',
};

function UserManagement() {
  const [activeTab, setActiveTab] = useState('users');

  const [users, setUsers] = useState([]);
  const [logs, setLogs] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const [selectedType, setSelectedType] = useState('WARNING');
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const ADMIN_ID = 1;

  // 회원 목록 조회
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axiosInstance.get('/admin/users/search');
        setUsers(res.data);
      } catch (error) {
        console.error('회원 목록 조회 실패:', error);
      }
    };
    fetchUsers();
  }, []);

  // 운영 이력 탭 진입 시 전체 이력 조회
  useEffect(() => {
    if (activeTab !== 'logs') return;

    const fetchAllLogs = async () => {
      try {
        const res = await axiosInstance.get('/admin/users/history');
        setLogs(res.data);
      } catch (error) {
        console.error('전체 운영 이력 조회 실패:', error);
        setLogs([]);
      }
    };

    fetchAllLogs();
  }, [activeTab]);

  // 모달 열기 (특정 유저 이력 포함)
  const handleOpenModal = async (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);

    try {
      const res = await axiosInstance.get(
        `/admin/users/${user.userId}/history`
      );
      setLogs(res.data);
    } catch (error) {
      console.error('회원 조치 이력 조회 실패:', error);
      setLogs([]);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
    setSelectedType('WARNING');
    setReason('');
  };

  // 조치 적용
  const handleSubmitAction = async () => {
    if (!selectedUser) {
      alert('대상 사용자가 선택되지 않았습니다.');
      return;
    }
    if (!reason.trim()) {
      alert('조치 사유를 입력해주세요.');
      return;
    }

    if (!window.confirm('정말 이 조치를 적용하시겠습니까?')) return;

    try {
      setIsSubmitting(true);

      await axiosInstance.post(
        `/admin/users/${selectedUser.userId}/action`,
        {
          type: selectedType,
          reason,
          adminId: ADMIN_ID,
        }
      );

      // 목록 갱신
      const usersRes = await axiosInstance.get('/admin/users/search');
      setUsers(usersRes.data);

      handleCloseModal();
    } catch (error) {
      console.error('조치 적용 실패:', error);
      alert('조치 적용 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 제재 해제
  const handleReleaseUser = async (user) => {
    if (!window.confirm('해당 사용자의 제재를 해제하시겠습니까?')) return;

    try {
      await axiosInstance.patch(
        `/admin/users/${user.userId}/release?adminId=${ADMIN_ID}`
      );

      const usersRes = await axiosInstance.get('/admin/users/search');
      setUsers(usersRes.data);
    } catch (error) {
      console.error('제재 해제 실패:', error);
      alert('제재 해제 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="user-management">
      <h1 className="admin-title">사용자 · 운영 관리</h1>
      <p className="admin-subtitle">
        사용자 계정 상태와 운영자 조치 이력을 조회하고 관리할 수 있습니다.
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

      <section className="admin-card">
        {activeTab === 'users' ? (
          /* 회원 목록 테이블 */
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>이메일</th>
                <th>계정 상태</th>
                <th>액션</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.userId}>
                  <td>{u.userId}</td>
                  <td>{u.email}</td>
                  <td>
                    <span
                      className={`badge badge-${String(u.status).toLowerCase()}`}
                    >
                      {u.status}
                    </span>
                  </td>
                  <td className="admin-action-cell">
                    <button
                      className="btn-admin-action"
                      onClick={() => handleOpenModal(u)}
                    >
                      조치하기
                    </button>
                    {u.status !== 'NORMAL' && (
                      <button
                        className="btn-admin-release"
                        onClick={() => handleReleaseUser(u)}
                      >
                        제재 해제
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={4} style={{ textAlign: 'center', padding: '24px 0' }}>
                    조회된 회원이 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        ) : (
          /* 운영 이력 테이블 */
          <table className="admin-table">
            <thead>
              <tr>
                <th>시간</th>
                <th>대상 이메일</th>
                <th>조치 유형</th>
                <th>관리자</th>
                <th>사유</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => {
                const label = STATE_TYPE_LABEL[log.type] || log.type;
                const time = log.stateDate || log.createdDate;

                return (
                  <tr key={log.stateId}>
                    <td>{time}</td>
                    <td>{log.userEmail}</td>
                    <td>{label}</td>
                    <td>{log.adminId}</td>
                    <td className="reason-col">{log.reason}</td>
                  </tr>
                );
              })}
              {logs.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '24px 0' }}>
                    이력이 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </section>

      {/* 조치 모달 */}
      {isModalOpen && selectedUser && (
        <div className="modal-backdrop" onClick={handleCloseModal}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>운영 조치 적용</h2>
              <button className="close-x" onClick={handleCloseModal}>
                &times;
              </button>
            </div>

            <div className="modal-body">
              <div className="info-row">
                <span>대상 사용자:</span>{' '}
                <strong>
                  {selectedUser.userId} ({selectedUser.email})
                </strong>
              </div>

              <div className="input-group">
                <label>조치 유형</label>
                <select
                  className="modal-select"
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                >
                  <option value="WARNING">주의(경고)</option>
                  <option value="SUSPENDED">정지</option>
                </select>
              </div>

              <div className="input-group">
                <label>조치 사유</label>
                <textarea
                  className="modal-textarea"
                  placeholder="관리자 코멘트를 입력하세요 (제재 근거 등)"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                />
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-secondary" onClick={handleCloseModal}>
                취소
              </button>
              <button
                className="btn-primary"
                onClick={handleSubmitAction}
                disabled={isSubmitting}
              >
                {isSubmitting ? '적용 중...' : '적용하기'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserManagement;
