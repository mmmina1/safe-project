import React from 'react';
import { Link } from 'react-router-dom';
import { FileSearch, MessageSquare, Gamepad2, ArrowRight } from 'lucide-react';
import './LandingView.css';

const LandingView = () => {
    const services = [
        {
            id: 'diagnosis',
            title: '피싱 위험 진단',
            subtitle: '(Survey)',
            description: '간단한 설문을 통해 현재 보이스피싱 노출 정도를 진단하고 맞춤형 대응책을 받아보세요.',
            icon: <FileSearch size={32} />,
            link: '/ai/diagnosis',
            btnText: '진단하기'
        },
        {
            id: 'chatbot',
            title: 'AI 실시간 상담',
            subtitle: '(Counseling)',
            description: '의심스러운 상황이나 문자를 입력하면 AI가 실시간으로 피싱 여부를 분석해 드립니다.',
            icon: <MessageSquare size={32} />,
            link: '/chatbot',
            btnText: '상담하기'
        },
        {
            id: 'simulator',
            title: '실전 모의 훈련',
            subtitle: '(Training)',
            description: '가상 환경에서 다양한 피싱 상황을 직접 체험하며 올바른 대처 능력을 키워보세요.',
            icon: <Gamepad2 size={32} />,
            link: '/ai/simulator',
            btnText: '훈련 시작'
        }
    ];

    return (
        <div className="ai-hub-container animate-fade-in">
            {/* 히어로 섹션 */}
            <header className="ai-hero">
                <div className="ai-hero-content">
                    <h1>보이스피싱,<br />AI가 당신을 보호합니다.</h1>
                    <p>
                        Safe 프로젝트의 스마트 AI 솔루션으로 금융 사기로부터 소중한 자산을 안전하게 지키세요.<br />
                        진단부터 실전 훈련까지 종합적인 예방 솔루션을 제공합니다.
                    </p>
                    <Link to="/ai/diagnosis" className="btn-hero">
                        지금 바로 진단하기
                    </Link>
                </div>
            </header>

            {/* 서비스 카드 리스트 */}
            <main className="ai-services-grid">
                {services.map((service) => (
                    <div key={service.id} className="service-card">
                        <div className="icon-wrapper">
                            {service.icon}
                        </div>
                        <h3>{service.title}</h3>
                        <span>{service.subtitle}</span>
                        <p>{service.description}</p>
                        <Link to={service.link} className="btn-service d-flex align-items-center justify-content-center gap-2">
                            {service.btnText} <ArrowRight size={18} />
                        </Link>
                    </div>
                ))}
            </main>
        </div>
    );
};

export default LandingView;
