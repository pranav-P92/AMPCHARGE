// src/components/Navbar/Navbar.jsx

import React, { useState, useEffect } from 'react';
import title from './title.png';
import './navbar.css';
import { useNavigate } from 'react-router-dom';

function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('user'));
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    navigate('/login');
  };

  // Update isLoggedIn state on component mount to sync with localStorage
  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem('user'));
  }, []);

  return (
    <div className='navbar-container'>
      <div className="title">
        <a href="/"><img src={title} alt="titleimage" /></a>
      </div>
      <div className="navlinks">
        <a href="/find">Find</a>
        <a href="/admin">Business</a>
        
        {isLoggedIn ? (
          <a href="#" onClick={handleLogout}>Logout</a>
        ) : (
          <a href="/login">Login</a>
        )}
      </div>
    </div>
  );
}

export default Navbar;