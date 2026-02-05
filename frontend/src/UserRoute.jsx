// src/UserRoute.jsx
import { Navigate } from 'react-router-dom';

function UserRoute({ children }) {
    const token = localStorage.getItem('accessToken');
    const role = localStorage.getItem('role'); // 로그인 응답에서 저장한 값

    // 1) 비로그인 -> 로그인 페이지로
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // 2) 로그인 상태면 통과
    return children;
}

export default UserRoute;
