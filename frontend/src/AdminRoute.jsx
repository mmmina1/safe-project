// src/AdminRoute.jsx
import { Navigate } from 'react-router-dom';

function AdminRoute({ children }) {
  const token = localStorage.getItem('accessToken');
  const role = localStorage.getItem('role'); // 로그인 응답에서 저장한 값

  // 1) 비로그인 -> 로그인 페이지로
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // 2) 로그인은 했는데 관리자 아님 -> 메인으로
  if (role !== 'ADMIN') {
    return <Navigate to="/" replace />;
  }

  // 3) 관리자면 통과
  return children;
}

export default AdminRoute;
