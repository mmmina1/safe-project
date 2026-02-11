// src/UserRoute.jsx
import { Navigate } from 'react-router-dom';

function UserRoute({ children }) {
  const token = localStorage.getItem('accessToken');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

export default UserRoute;
