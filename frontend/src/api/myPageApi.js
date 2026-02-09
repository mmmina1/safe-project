import axiosInstance from './axiosInstance'; // 같은 폴더에 있으므로 경로가 간결해짐

/**
 * 마이페이지 대시보드 데이터 조회
 * GET /api/mypage/dashboard
 */
export const getDashboardData = async () => {

    const token = localStorage.getItem('accessToken');

    try {
        const response = await axiosInstance.get('/api/mypage/dashboard', {
            headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        return response.data;
    } catch (error) {
        // 에러를 여기서만 찍고 끝낼지, 위로 던질지 결정
        console.error('대시보드 조회 실패:', error);
        throw error; // 화면에서 에러 처리를 위해 throw
    }


};


// 닉네임 수정
export const updateNickname = async (nickname) => {
    const token = localStorage.getItem('accessToken');
    const response = await axiosInstance.patch('/api/mypage/nickname',
        { nickname }, // 전송할 데이터
        {
            headers: token ? { Authorization: `Bearer ${token}` } : {} // 신분증!
        }
    );
    return response.data;
};

// 비밀번호 수정
export const updatePassword = async (currentPassword, newPassword) => {
    const token = localStorage.getItem('accessToken');
    const response = await axiosInstance.patch('/api/mypage/password',
        { currentPassword, newPassword }, // 전송할 데이터
        {
            headers: token ? { Authorization: `Bearer ${token}` } : {} // 신분증!
        }
    );
    return response.data;
};