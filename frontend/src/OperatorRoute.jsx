// src/OperatorRoute.jsx
import { Navigate, useLocation } from 'react-router-dom';

function OperatorRoute({ children }) {
  const location = useLocation();
  const token = localStorage.getItem('accessToken');
  const role = localStorage.getItem('role');

  // 1) 로그인 안 되어 있으면 → 로그인 페이지로
  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // 2) OPERATOR가 아니면 → 메인으로 돌려보내기
  //   (만약 ADMIN도 허용하고 싶으면 role !== 'OPERATOR' 조건을
  //    ['ADMIN', 'OPERATOR'].includes(role)로 바꾸면 됩니다.)
  if (role !== 'OPERATOR') {
    return <Navigate to="/" replace />;
  }

  // 3) 통과
  return children;
}

export default OperatorRoute;
