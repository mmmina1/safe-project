// src/UserRoute.jsx
import { Navigate } from 'react-router-dom';

function UserRoute({ children }) {
  const token = localStorage.getItem('accessToken');

  // 로그인 안 되어 있으면 → 로그인 페이지로
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // 로그인 되어 있으면 통과
  return children;
}

export default UserRoute;
