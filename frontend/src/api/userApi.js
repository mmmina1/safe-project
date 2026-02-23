import axiosInstance from "./axiosInstance";

/**
 * 여러 사용자 ID로 사용자 정보를 조회합니다.
 * (현재 프로젝트에 해당 파일이 누락되어 있어 빌드 오류 방지를 위해 임시 생성되었습니다)
 */
export const getUsersByIds = async (userIds) => {
    // 실제 API 주소가 다를 수 있으므로 확인이 필요합니다.
    try {
        const res = await axiosInstance.get('/users/batch', {
            params: { ids: userIds.join(',') }
        });
        return res.data;
    } catch (error) {
        console.error('getUsersByIds failed:', error);
        return [];
    }
};

export const getUserProfile = async (userId) => {
    const res = await axiosInstance.get(`/users/${userId}`);
    return res.data;
};
