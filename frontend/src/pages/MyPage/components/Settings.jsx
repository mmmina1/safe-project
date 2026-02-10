// ============================================================
// 1. 임포트 구역
// ============================================================
import React, { useState, useEffect } from 'react';
import { CreditCard, Lock, User, ExternalLink, ShieldCheck, MapPin } from 'lucide-react';
import { getDashboardData, updateNickname, updatePassword } from '../../../api/myPageApi';

// ============================================================
// 2. 설정 및 관리 화면 부품
// ============================================================
const Settings = ({ initialTab = 'payment' }) => {
    // 결제수단 관리 탭과 프로필 관리 탭 중 하나를 선택한 상태를 갖습니다.
    const [activeTab, setActiveTab] = useState(initialTab);

    // [New] 닉네임 상태
    const [nickname, setNickname] = useState('익명유저123');

    // [New] 비밀번호 변경 모드 상태
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    // [New] 비밀번호 입력 폼 상태
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    // [New] 토스 연동 상태 (Mock)
    const [isTossLinked, setIsTossLinked] = useState(false);

    // 부모로부터 내려오는 탭 설정이 바뀌면 화면도 즉시 변경해줍니다.
    useEffect(() => {
        setActiveTab(initialTab);

        // 프로필 관리 탭이 활성화될 때 실제 유저 정보를 가져옵니다.
        if (initialTab === 'profile') {
            fetchUserProfile();
        }
    }, [initialTab]);

    const fetchUserProfile = async () => {
        try {
            const data = await getDashboardData();
            if (data && data.userName) {
                setNickname(data.userName);
            }
        } catch (error) {
            console.error('프로필 정보를 불러오는데 실패했습니다:', error);
        }
    };

    // 닉네임 변경 핸들러
    const handleNicknameChange = (e) => {
        setNickname(e.target.value);
    };

    // 비밀번호 입력 핸들러
    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordForm(prev => ({ ...prev, [name]: value }));
    };

    // 비밀번호 저장 핸들러
    const handleSavePassword = async () => {
        if (!passwordForm.currentPassword || !passwordForm.newPassword) {
            alert('비밀번호를 입력해주세요.');
            return;
        }
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            alert('새 비밀번호가 일치하지 않습니다.');
            return;
        }

        try {
            await updatePassword(passwordForm.currentPassword, passwordForm.newPassword);
            alert('비밀번호가 성공적으로 변경되었습니다.');
            setIsChangingPassword(false);
            setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (error) {
            const errorMessage = error.response?.data?.message || '비밀번호 변경에 실패했습니다. 현재 비밀번호를 확인해주세요.';
            alert(errorMessage);
        }
    };

    // 프로필 전체 저장 (닉네임 등)
    const handleSaveProfile = async () => {
        if (!nickname.trim()) {
            alert('닉네임을 입력해주세요.');
            return;
        }

        try {
            await updateNickname(nickname);
            localStorage.setItem('userName', nickname);
            alert(`'${nickname}'(으)로 닉네임이 저장되었습니다.`);
        } catch (error) {
            console.error('닉네임 저장 실패:', error);
            alert('닉네임 저장에 실패했습니다.');
        }
    };

    // 토스 연동 핸들러 (Mock)
    const handleLinkToss = () => {
        // TODO: 토스 페이먼츠 위젯 연동 로직
        const confirmLink = window.confirm('토스페이먼츠 연동 페이지로 이동합니다.\n(연동 시뮬레이션)');
        if (confirmLink) {
            setTimeout(() => {
                setIsTossLinked(true);
                alert('토스페이먼츠 연동이 완료되었습니다!');
            }, 1000);
        }
    };

    return (
        <div className="animate-fade-in">
            <h2 className="page-title">설정</h2>

            {/* 상단 서브 메뉴 탭 */}
            <div className="nav nav-pills mb-4 p-2 rounded-3 shadow-none d-inline-flex border border-secondary">
                <button
                    className={`nav-link px-4 ${activeTab === 'payment' ? 'active' : 'text-white'}`}
                    onClick={() => setActiveTab('payment')}
                >
                    결제수단 관리
                </button>
                <button
                    className={`nav-link px-4 ${activeTab === 'profile' ? 'active' : 'text-white'}`}
                    onClick={() => setActiveTab('profile')}
                >
                    프로필 관리
                </button>
            </div>

            {/* --- CASE A: 결제수단 관리 탭 --- */}
            {activeTab === 'payment' && (
                <div className="animate-fade-in">
                    {/* 토스페이먼츠 연동 유도 섹션 */}
                    <div className="dashboard-card mb-4 border border-secondary p-5 text-center" style={{ background: 'rgba(255,255,255,0.02)' }}>
                        <h4 className="fw-bold mb-3">토스페이먼츠 연동</h4>
                        <p className="text-secondary mb-4">쉽고 빠른 결제를 위해 토스페이를 연결하세요.<br />연동 시 첫 결제 1,000원 할인 혜택을 드립니다.</p>

                        {isTossLinked ? (
                            <div className="text-success fw-bold mb-4 d-flex justify-content-center align-items-center">
                                <ShieldCheck size={24} className="me-2" />
                                현재 상태: 연동 완료
                            </div>
                        ) : (
                            <div className="text-secondary small mb-4">현재 상태: <span className="text-danger fw-bold">미연동</span></div>
                        )}

                        <button
                            className={`btn ${isTossLinked ? 'btn-outline-success' : 'btn-primary'} px-5 py-3 fw-bold d-inline-flex align-items-center`}
                            onClick={handleLinkToss}
                            disabled={isTossLinked}
                        >
                            {isTossLinked ? '연동 관리하기' : '토스페이 연동하기'} <ExternalLink size={18} className="ms-2" />
                        </button>
                    </div>

                    <h5 className="card-label mb-3">등록된 결제 수단</h5>
                    <div className="dashboard-card p-0 overflow-hidden">
                        {/* 저장된 결제 수단 예시 데이터들 */}
                        {[
                            { type: '카드', name: '신한카드', number: '1234-****-****-5678', isMain: true },
                            { type: '계좌', name: '토스뱅크', number: '1000-***-*****', isMain: false },
                        ].map((method, idx) => (
                            <div key={idx} className="p-4 border-bottom border-secondary d-flex align-items-center">
                                <div className="bg-dark rounded p-3 me-4 text-center border border-secondary" style={{ width: '60px' }}>
                                    <CreditCard size={24} className="text-primary" />
                                </div>
                                <div className="flex-grow-1">
                                    <div className="d-flex align-items-center">
                                        <span className="badge bg-secondary me-2">{method.type}</span>
                                        <h6 className="mb-0">{method.name} ({method.number})</h6>
                                        {method.isMain && <span className="ms-3 badge bg-primary">기본</span>}
                                    </div>
                                </div>
                                <button className="btn btn-sm btn-outline-secondary me-2">설정</button>
                                <button className="btn btn-sm btn-outline-danger">삭제</button>
                            </div>
                        ))}
                        <div className="p-4 text-center">
                            <button className="btn btn-link text-decoration-none text-secondary">+ 새 결제수단 추가</button>
                        </div>
                    </div>
                </div>
            )}

            {/* --- CASE B: 프로필 관리 탭 --- */}
            {activeTab === 'profile' && (
                <div className="animate-fade-in">
                    <div className="dashboard-card p-4">
                        <h5 className="card-label mb-4">계정 정보 설정</h5>

                        {/* 1. 닉네임 (수정 가능) */}
                        <div className="mb-4">
                            <label className="form-label text-secondary small fw-bold mb-2">닉네임</label>
                            <div className="d-flex gap-2">
                                <div className="position-relative flex-grow-1">
                                    <div className="position-absolute h-100 d-flex align-items-center ps-3 text-secondary">
                                        <User size={18} />
                                    </div>
                                    <input
                                        type="text"
                                        className="form-control bg-transparent border-secondary text-white w-100"
                                        style={{ paddingLeft: '45px', height: '48px' }}
                                        value={nickname}
                                        onChange={handleNicknameChange}
                                        placeholder="닉네임을 입력하세요"
                                    />
                                </div>
                                <button
                                    className="btn btn-primary px-4 fw-bold"
                                    style={{ height: '48px', minWidth: '100px' }}
                                    onClick={handleSaveProfile}
                                >
                                    변경
                                </button>
                            </div>
                            <div className="form-text text-muted mt-2 small">서비스 내에서 표시될 이름을 설정하세요.</div>
                        </div>

                        {/* 3. 비밀번호 (수정 가능) */}
                        <div className="mb-5">
                            <label className="form-label text-secondary small fw-bold mb-2">비밀번호 보안</label>
                            <div>
                                {!isChangingPassword ? (
                                    <div className="d-flex align-items-center justify-content-between p-3 rounded border border-secondary" style={{ background: 'rgba(255,255,255,0.02)', height: '56px' }}>
                                        <div className="d-flex align-items-center">
                                            <Lock size={20} className="text-secondary me-3" />
                                            <span className="text-white">사용 중인 비밀번호</span>
                                        </div>
                                        <button
                                            className="btn btn-sm btn-outline-secondary px-3"
                                            onClick={() => setIsChangingPassword(true)}
                                        >
                                            비밀번호 변경
                                        </button>
                                    </div>
                                ) : (
                                    <div className="p-4 rounded border border-secondary" style={{ background: 'rgba(255,255,255,0.03)' }}>
                                        <div className="d-flex align-items-center mb-4 pb-2 border-bottom border-secondary">
                                            <Lock size={18} className="text-primary me-2" />
                                            <h6 className="mb-0">비밀번호 변경</h6>
                                        </div>

                                        <div className="mb-3">
                                            <label className="form-label small text-secondary">현재 비밀번호</label>
                                            <input
                                                type="password"
                                                name="currentPassword"
                                                className="form-control bg-transparent border-secondary text-white"
                                                style={{ height: '42px' }}
                                                value={passwordForm.currentPassword}
                                                onChange={handlePasswordChange}
                                                placeholder="현재 비밀번호를 입력하세요"
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label small text-secondary">새 비밀번호</label>
                                            <input
                                                type="password"
                                                name="newPassword"
                                                className="form-control bg-transparent border-secondary text-white"
                                                style={{ height: '42px' }}
                                                value={passwordForm.newPassword}
                                                onChange={handlePasswordChange}
                                                placeholder="새로운 비밀번호"
                                            />
                                        </div>
                                        <div className="mb-4">
                                            <label className="form-label small text-secondary">새 비밀번호 확인</label>
                                            <input
                                                type="password"
                                                name="confirmPassword"
                                                className="form-control bg-transparent border-secondary text-white"
                                                style={{ height: '42px' }}
                                                value={passwordForm.confirmPassword}
                                                onChange={handlePasswordChange}
                                                placeholder="새 비밀번호 다시 입력"
                                            />
                                        </div>
                                        <div className="d-flex gap-2">
                                            <button
                                                className="btn btn-primary w-100 py-2 fw-bold"
                                                onClick={handleSavePassword}
                                            >
                                                변경 완료
                                            </button>
                                            <button
                                                className="btn btn-outline-secondary w-100 py-2"
                                                onClick={() => setIsChangingPassword(false)}
                                            >
                                                취소
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* 폼 하단 작업 바 */}
                        <div className="border-top border-secondary pt-4 d-flex justify-content-between align-items-center">
                            <span className="text-secondary small">회원님의 정보는 안전하게 보호됩니다.</span>
                            <button className="btn btn-link text-danger text-decoration-none small p-0">회원탈퇴</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Settings;
