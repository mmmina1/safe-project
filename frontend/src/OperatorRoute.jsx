// src/OperatorRoute.jsx
import { Navigate, useLocation } from 'react-router-dom';

function OperatorRoute({ children }) {
  const location = useLocation();
  const token = localStorage.getItem('accessToken');
  const roleRaw = localStorage.getItem('role') || '';
  const role = roleRaw.trim();

  console.log('[OperatorRoute] token =', token, 'role =', role);

  // 1) 로그인 안 되어 있으면 → 로그인 페이지로
  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // 2) ADMIN 또는 OPERATOR면 통과
  //    (ROLE_ADMIN, ROLE_OPERATOR, "ROLE_ADMIN,ROLE_OPERATOR"도 전부 포함되게)
  const isAdmin = role.includes('ADMIN');
  const isOperator = role.includes('OPERATOR');
  const hasPermission = isAdmin || isOperator;

  if (!hasPermission) {
    // 권한 없으면 메인으로
    return <Navigate to="/" replace />;
  }

  // 3) 통과
  return children;
}

export default OperatorRoute;
