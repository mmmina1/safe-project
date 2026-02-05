import axios from 'axios';

const api = axios.create({
    baseURL: '/api/ai',  // Spring Boot proxy를 통해 Python 연결
});

export const phishService = {
    chat: async (message) => {
        try {
            const response = await api.post('/chat', {
                message,
                session_id: 'react_user',
                use_rag: true
            });
            return response.data;
        } catch (error) {
            console.error('Chat API Error:', error);
            throw error;
        }
    },

    submitDiagnosis: async (answers) => {
        try {
            const response = await api.post('/diagnosis/', {
                answers
            });
            return response.data;
        } catch (error) {
            console.error('Diagnosis API Error:', error);
            throw error;
        }
    }
};
