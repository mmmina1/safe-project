// ============================================================
// 1. 임포트 구역
// ============================================================
import React, { useState } from 'react';
import { CreditCard, Lock, User, ExternalLink, ShieldCheck, MapPin } from 'lucide-react';

// ============================================================
// 2. 설정 및 관리 화면 부품
// ============================================================
const Settings = ({ initialTab = 'payment' }) => {
    // 결제수단 관리 탭과 프로필 관리 탭 중 하나를 선택한 상태를 갖습니다.
    const [activeTab, setActiveTab] = useState(initialTab);

    // 부모로부터 내려오는 탭 설정이 바뀌면 화면도 즉시 변경해줍니다.
    React.useEffect(() => {
        setActiveTab(initialTab);
    }, [initialTab]);

    return (
        <div className="animate-fade-in">
            <h2 className="page-title">설정</h2>

            {/* 상단 서브 메뉴 탭 */}
            <div className="nav nav-pills mb-4 bg-white p-2 rounded-3 shadow-sm d-inline-flex">
                <button
                    className={`nav-link px-4 ${activeTab === 'payment' ? 'active' : ''}`}
                    onClick={() => setActiveTab('payment')}
                >
                    결제수단 관리
                </button>
                <button
                    className={`nav-link px-4 ${activeTab === 'profile' ? 'active' : ''}`}
                    onClick={() => setActiveTab('profile')}
                >
                    프로필 관리
                </button>
            </div>

            {/* --- CASE A: 결제수단 관리 탭 --- */}
            {activeTab === 'payment' && (
                <div className="animate-fade-in">
                    {/* 토스페이먼츠 연동 유도 섹션 */}
                    <div className="dashboard-card mb-4 bg-light border-0 p-5 text-center">
                        <h4 className="fw-bold mb-3">토스페이먼츠 연동</h4>
                        <p className="text-muted mb-4">쉽고 빠른 결제를 위해 토스페이를 연결하세요.<br />연동 시 첫 결제 1,000원 할인 혜택을 드립니다.</p>
                        <div className="text-muted small mb-4">현재 상태: <span className="text-danger fw-bold">미연동</span></div>
                        <button className="btn btn-primary px-5 py-3 fw-bold d-inline-flex align-items-center">
                            토스페이 연동하기 <ExternalLink size={18} className="ms-2" />
                        </button>
                    </div>

                    <h5 className="card-label mb-3">등록된 결제 수단</h5>
                    <div className="dashboard-card p-0 overflow-hidden">
                        {/* 저장된 결제 수단 예시 데이터들 */}
                        {[
                            { type: '카드', name: '신한카드', number: '1234-****-****-5678', isMain: true },
                            { type: '계좌', name: '토스뱅크', number: '1000-***-*****', isMain: false },
                        ].map((method, idx) => (
                            <div key={idx} className="p-4 border-bottom d-flex align-items-center">
                                <div className="bg-light rounded p-3 me-4 text-center" style={{ width: '60px' }}>
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
                            <button className="btn btn-link text-decoration-none">+ 새 결제수단 추가</button>
                        </div>
                    </div>
                </div>
            )}

            {/* --- CASE B: 프로필 관리 탭 --- */}
            {activeTab === 'profile' && (
                <div className="animate-fade-in">
                    <div className="dashboard-card p-4">
                        {/* 회원 정보 수정 폼 영역 */}
                        <div className="mb-4">
                            <label className="form-label text-muted small fw-bold">아이디(이메일)</label>
                            <input type="text" className="form-control bg-light" value="chlalsdk5743@gmail.com" readOnly />
                        </div>
                        <div className="mb-4">
                            <label className="form-label text-muted small fw-bold">휴대폰 번호</label>
                            <div className="input-group">
                                <input type="text" className="form-control" defaultValue="010-1234-5678" />
                                <button className="btn btn-outline-primary">번호 변경</button>
                            </div>
                        </div>
                        <div className="mb-5">
                            <label className="form-label text-muted small fw-bold">비밀번호</label>
                            <div>
                                <button className="btn btn-outline-secondary">비밀번호 변경하기</button>
                            </div>
                        </div>

                        {/* 폼 하단 작업 바 */}
                        <div className="border-top pt-4 d-flex justify-content-between align-items-center">
                            <button className="btn btn-primary px-5">저장하기</button>
                            <button className="btn btn-link text-danger text-decoration-none small">회원탈퇴</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Settings;
