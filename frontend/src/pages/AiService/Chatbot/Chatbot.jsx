import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, ShieldCheck } from 'lucide-react';
import { phishService } from '../api'; // [중요] 같은 식구인 api.js 부르기

const Chatbot = () => {
    const [messages, setMessages] = useState([
        {
            id: 1,
            text: "안녕하세요! 보이스피싱 예방 챗봇입니다. 의심스러운 문자나 톡 내용을 보여주시면 분석해드릴게요.",
            sender: 'bot',
            timestamp: new Date()
        }
    ]);
    const [inputText, setInputText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!inputText.trim()) return;

        const userMessage = {
            id: Date.now(),
            text: inputText,
            sender: 'user',
            timestamp: new Date()
        };

        // 1. 사용자 메시지 화면에 표시
        setMessages(prev => [...prev, userMessage]);
        setInputText('');
        setIsLoading(true);

        try {
            // 2. api.js에게 일을 시킴 (서버야 대답 좀 해줘)
            const data = await phishService.chat(userMessage.text);

            const botResponse = {
                id: Date.now() + 1,
                text: data.answer,
                sender: 'bot',
                timestamp: new Date(),
                mode: data.mode,
                sources: data.sources // 근거 자료(RAG)
            };

            // 3. AI 응답 화면에 표시
            setMessages(prev => [...prev, botResponse]);
        } catch (error) {
            console.error("Chat Error:", error);
            const errorMsg = {
                id: Date.now() + 1,
                text: "죄송합니다. 서버 연결에 문제가 생겼습니다.",
                sender: 'bot',
                isError: true,
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container mt-4">
            <div className="card shadow-sm" style={{ height: '70vh', maxWidth: '800px', margin: '0 auto' }}>
                {/* 헤더 */}
                <div className="card-header bg-primary text-white d-flex align-items-center">
                    <ShieldCheck className="me-2" />
                    <h5 className="mb-0">SecureGuard AI Chatbot</h5>
                </div>

                {/* 채팅 내용 영역 */}
                <div className="card-body overflow-auto bg-light">
                    {messages.map((msg) => (
                        <div key={msg.id} className={`d-flex mb-3 ${msg.sender === 'user' ? 'justify-content-end' : 'justify-content-start'}`}>
                            {/* 봇 아이콘 */}
                            {msg.sender === 'bot' && (
                                <div className="me-2 text-primary"><Bot size={24} /></div>
                            )}

                            {/* 말풍선 */}
                            <div style={{ maxWidth: '75%' }}>
                                <div className={`p-3 rounded-3 ${msg.sender === 'user' ? 'bg-primary text-white' : 'bg-white border shadow-sm'}`}>
                                    <p className="mb-1" style={{ whiteSpace: 'pre-line' }}>{msg.text}</p>

                                    {/* 근거 자료가 있으면 보여주기 */}
                                    {msg.sources && msg.sources.length > 0 && (
                                        <div className="mt-2 pt-2 border-top small opacity-75">
                                            <strong>📚 참고 문서:</strong>
                                            <ul className="ps-3 mb-0">
                                                {msg.sources.map((src, idx) => (
                                                    <li key={idx}>[{src.source}] {src.content}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                                <div className="text-muted small mt-1 text-end">
                                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                            </div>

                            {/* 사용자 아이콘 */}
                            {msg.sender === 'user' && (
                                <div className="ms-2 text-secondary"><User size={24} /></div>
                            )}
                        </div>
                    ))}
                    {/* 로딩 표시 */}
                    {isLoading && (
                        <div className="text-center text-muted my-3">
                            <span className="spinner-border spinner-border-sm me-2"></span>
                            AI가 분석 중입니다...
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* 입력창 */}
                <div className="card-footer bg-white">
                    <form onSubmit={handleSendMessage} className="d-flex gap-2">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="메시지를 입력하세요 (예: 검찰이라며 돈을 보내라고 합니다)"
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            disabled={isLoading}
                        />
                        <button type="submit" className="btn btn-primary" disabled={isLoading || !inputText.trim()}>
                            <Send size={18} />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Chatbot;