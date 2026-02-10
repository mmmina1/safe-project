// import axios from 'axios';
import axiosInstance from './axiosInstance';
// const api = axios.create({
//     baseURL: '/api/ai',  // Spring Boot proxy를 통해 Python 연결
// });

export const phishService = {
    chat: async (message) => {
        try {
            const token = localStorage.getItem('accessToken');
            const response = await axiosInstance.post('/api/ai/chat',
                {
                    message,
                    // session_id: 'react_user', // 2. 가짜 이름표 삭제
                    use_rag: true
                },
                {
                    // 3. 신분증 제시 (토큰이 있을 때만)
                    headers: token ? { Authorization: `Bearer ${token}` } : {}
                }
            );
            return response.data;
        } catch (error) {
            console.error('Chat API Error:', error);
            throw error;
        }
    },

    getChatHistory: async () => {
        try {
            const token = localStorage.getItem('accessToken');

            if (!token) {
                return [];
            }
            const response = await axiosInstance.get('/api/ai/history', {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data;
        } catch (error) {
            console.error('Get History API Error:', error);
            throw error;
        }
    },

    submitDiagnosis: async (score, answers, recommendations) => { // [변경] 인자 추가
        try {
            const token = localStorage.getItem('accessToken');
            const response = await axiosInstance.post('/api/ai/diagnosis/submit',
                {
                    score,
                    answers,
                    recommendations // [추가] 추천 항목 리스트
                },
                {
                    headers: token ? { Authorization: `Bearer ${token}` } : {}
                });
            return response.data;
        } catch (error) {
            console.error('Diagnosis API Error:', error);
            throw error;
        }
    },
};
