import React, { useState, useEffect } from 'react';
import { Nav } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

function UserAuthNav() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // localStorage에서 로그인 상태 확인
    const token = localStorage.getItem('accessToken');
    const name = localStorage.getItem('userName');
    
    setIsLoggedIn(!!token);
    setUserName(name || '');
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userName');
    setIsLoggedIn(false);
    setUserName('');
    navigate('/');
  };

  if (isLoggedIn) {
    return (
      <Nav className="ms-auto align-items-center">
        <Nav.Link
          as="span"
          className="text-white me-3"
          style={{ fontSize: '1rem' }}
        >
          {userName}님
        </Nav.Link>
        <Nav.Link
          as="button"
          onClick={handleLogout}
          className="btn btn-outline-light btn-sm"
          style={{ fontSize: '0.9rem' }}
        >
          로그아웃
        </Nav.Link>
      </Nav>
    );
  }

  return (
    <Nav className="ms-auto align-items-center gap-2">
      <Nav.Link
        as={Link}
        to="/login"
        className="btn btn-outline-light btn-sm"
        style={{ fontSize: '0.9rem' }}
      >
        로그인
      </Nav.Link>
      <Nav.Link
        as={Link}
        to="/signup"
        className="btn btn-primary btn-sm"
        style={{ fontSize: '0.9rem' }}
      >
        회원가입
      </Nav.Link>
    </Nav>
  );
}

export default UserAuthNav;
