// ============================================================
// 1. 임포트 구역 (라이브러리 및 API 서비스)
// ============================================================
import { useState, useRef, useEffect } from 'react';
import { phishService } from '../../api';

// ============================================================
// 2. 비즈니스 로직 구역 (커스텀 훅 정의)
// ============================================================

/**
 * useChatbot: 챗봇의 상태 관리 및 API 통신 로직을 담당하는 커스텀 훅
 */
export const useChatbot = () => {
    // --- [상태 관리] ---

    // 메세지 목록을 저장하는 변수
    // 초기값: 챗봇의 인사 메시지
    const [messages, setMessages] = useState([
        {
            id: 1,
            text: "안녕하세요! 보이스피싱 예방 챗봇입니다. 의심스러운 문자나 톡 내용을 보여주시면 분석해드릴게요.",
            sender: 'bot',
            timestamp: new Date()
        }
    ]);
    // 사용자 입력 텍스트를 저장하는 변수
    const [inputText, setInputText] = useState('');
    // API 호출 중 상태를 저장하는 변수
    const [isLoading, setIsLoading] = useState(false);

    // --- [DOM 참조] ---
    // 메시지 영역의 마지막 요소를 참조하는 변수
    const messagesEndRef = useRef(null);

    // --- [효과 및 유틸리티] ---
    // 메시지 영역을 하단으로 스크롤하는 함수
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    // 메시지가 추가될 때마다 하단으로 자동 스크롤
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // --- [이벤트 핸들러] ---
    // 사용자가 메시지를 보내는 함수
    const handleSendMessage = async (e) => {
        if (e) e.preventDefault();
        if (!inputText.trim()) return;

        // 1. 사용자 메시지 생성 및 추가
        const userMessage = {
            id: Date.now(),
            text: inputText,
            sender: 'user',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputText('');
        setIsLoading(true);

        try {
            // 2. 백엔드 AI 분석 결과 요청
            const data = await phishService.chat(userMessage.text);

            const botResponse = {
                id: Date.now() + 1,
                text: data.answer,
                sender: 'bot',
                timestamp: new Date(),
                mode: data.mode,
                sources: data.sources // RAG 기반 근거 자료
            };

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

    // --- [외부 노출 데이터 및 함수] ---
    return {
        messages,
        inputText,
        setInputText,
        isLoading,
        handleSendMessage,
        messagesEndRef
    };
};
