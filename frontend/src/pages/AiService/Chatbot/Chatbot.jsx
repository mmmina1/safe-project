import React from 'react';
import { Send, Bot, User, ShieldCheck } from 'lucide-react';
import { useChatbot } from './hooks/useChatbot';
import './Chatbot.css';

/**
 * ChatHeader: 챗봇 하단 헤더 
 */
const ChatHeader = () => (
    // <div></div>
    <div className="chatbot-header d-flex align-items-center">
        <ShieldCheck className="me-3" size={28} />
        <div>
            <h5 className="mb-0">Risk Watch AI</h5>
            <small className="opacity-75">보이스피싱 예방 챗봇</small>
        </div>
    </div>
);

/**
 * MessageItem: 개별 메시지 말풍선
 */
const MessageItem = ({ msg }) => {
    const isBot = msg.sender === 'bot';

    return (
        <div className={`message-wrapper ${isBot ? 'bot-align' : 'user-align'}`}>
            <div className="icon-area">
                {isBot ? <Bot size={22} className="text-primary" /> : <User size={22} className="text-secondary" />}
            </div>

            <div className="message-content">
                <div className={`message-bubble ${isBot ? 'msg-bot' : 'msg-user'}`}>
                    <p className="mb-0" style={{ whiteSpace: 'pre-line' }}>{msg.text}</p>

                    {isBot && msg.sources && msg.sources.length > 0 && (
                        <div className="source-box">
                            <strong>📚 분석 근거:</strong>
                            <ul className="ps-3 mb-0">
                                {msg.sources.map((src, idx) => (
                                    <li key={idx}>[{src.source}] {src.content}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
                <div className="timestamp">
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
            </div>
        </div>
    );
};

/**
 * Chatbot: 메인 컨테이너 컴포넌트
 */
const Chatbot = () => {
    const {
        messages,
        inputText,
        setInputText,
        isLoading,
        handleSendMessage,
        messagesEndRef
    } = useChatbot();



    return (
        <div className="container chatbot-container mt-4">
            <div className="card chatbot-card" style={{ maxWidth: '900px', margin: '0 auto' }}>
                <ChatHeader />

                {/* 메시지 리스트 영역 */}
                <div className="card-body chatbot-body overflow-auto">
                    {messages.map((msg) => (
                        <MessageItem key={msg.id} msg={msg} />
                    ))}

                    {isLoading && (
                        <div className="d-flex align-items-center text-muted my-3 px-3">
                            <div className="spinner-grow spinner-grow-sm me-3 text-primary" role="status"></div>
                            <span className="small fw-medium">AI가 보안 가이드라인을 분석 중입니다...</span>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* 입력창 영역 */}
                <div className="card-footer chatbot-footer">
                    <form onSubmit={handleSendMessage} className="d-flex gap-3 px-2">
                        <input
                            type="text"
                            className="form-control chat-input"
                            placeholder="의심되는 상황을 말씀해주세요... (예: 검찰 사칭 문자를 받았어요)"
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            disabled={isLoading}
                        />
                        <button
                            type="submit"
                            className="btn send-btn"
                            disabled={isLoading || !inputText.trim()}
                        >
                            <Send size={20} color="white" />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Chatbot;
