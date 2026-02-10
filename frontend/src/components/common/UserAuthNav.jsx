<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
import { Nav } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
=======
// src/components/common/UserAuthNav.jsx
import React, { useEffect, useState } from 'react';
import { Nav, NavDropdown } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
>>>>>>> b7ecbb4e9b81c1a0582d7bc172551f8e0bb8bc1f

function UserAuthNav() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
<<<<<<< HEAD
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
=======
  const [role, setRole] = useState('');

  const location = useLocation();
  const navigate = useNavigate();

  // 라우트가 바뀔 때마다 토큰/이름/권한 다시 확인
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const name = localStorage.getItem('userName');
    const storedRole = localStorage.getItem('role') || '';

    setIsLoggedIn(!!token);
    setUserName(name || '');
    setRole(storedRole.trim());

    console.log(
      'UserAuthNav: token =',
      token,
      'isLoggedIn =',
      !!token,
      'userName =',
      name,
      'role =',
      storedRole
    );
  }, [location]);

  const isAdmin = role.includes('ADMIN');
  const isOperator = role.includes('OPERATOR');

  // 로그아웃
  const handleLogout = async () => {
    const provider = localStorage.getItem('loginProvider'); // 'KAKAO' / 'GOOGLE' / 'LOCAL' 등
    const kakaoAccessToken = localStorage.getItem('kakaoAccessToken');
    const ourToken = localStorage.getItem('accessToken');

    try {
      if (provider === 'KAKAO' && kakaoAccessToken) {
        await fetch('http://localhost:8080/api/auth/kakao/logout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(ourToken ? { Authorization: `Bearer ${ourToken}` } : {}),
          },
          body: JSON.stringify({ accessToken: kakaoAccessToken }),
        });
      }
    } catch (e) {
      console.error('카카오 로그아웃 호출 중 오류', e);
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('userName');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('loginProvider');
      localStorage.removeItem('kakaoAccessToken');
      localStorage.removeItem('role');

      setIsLoggedIn(false);
      setUserName('');
      setRole('');

      navigate('/');
    }
  };

  return (
    <Nav className="text-center align-items-center">
      {isLoggedIn ? (
        <>
          {/*  이름 클릭 시 드롭다운 */}
          <NavDropdown
            title={userName ? `${userName} 님` : '내 계정'}
            id="user-nav-dropdown"
            align="end"
            menuVariant="dark"
          >
            {/* 마이페이지 */}
            <NavDropdown.Item as={Link} to="/mypage">
              마이페이지
            </NavDropdown.Item>

            {/* ADMIN 권한일 때만 관리자/운영자 메뉴 둘 다 노출 */}
            {isAdmin && (
              <>
                <NavDropdown.Divider />
                <NavDropdown.Item as={Link} to="/admin">
                  관리자 페이지
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/operator">
                  운영자 페이지
                </NavDropdown.Item>
              </>
            )}

            {/* OPERATOR 전용 (ADMIN이 아니고 OPERATOR만 있는 경우) */}
            {!isAdmin && isOperator && (
              <>
                <NavDropdown.Divider />
                <NavDropdown.Item as={Link} to="/operator">
                  운영자 페이지
                </NavDropdown.Item>
              </>
            )}

            <NavDropdown.Divider />

            {/* 로그아웃 */}
            <NavDropdown.Item onClick={handleLogout}>
              로그아웃
            </NavDropdown.Item>
          </NavDropdown>
        </>
      ) : (
        <>
          <Nav.Link as={Link} to="/login">
            로그인
          </Nav.Link>
          <Nav.Link
            as={Link}
            to="/signup"
            className="fw-semibold text-warning"
          >
            회원가입
          </Nav.Link>
        </>
      )}
>>>>>>> b7ecbb4e9b81c1a0582d7bc172551f8e0bb8bc1f
    </Nav>
  );
}

export default UserAuthNav;
