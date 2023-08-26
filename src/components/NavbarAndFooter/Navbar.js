import React, { useState } from 'react';
import './Navbar.css';
import AuthPopup from '../Popup/AuthPopup';
import { useUserContext } from '../User/UserContext';
import { useNavigate } from 'react-router-dom';
import SideBar from '../User/SideBar';

function Navbar() {
  const [authPopupOpen, setAuthPopupOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const userContext = useUserContext();
  const navigate = useNavigate();

  const openAuthPopup = () => {
    setAuthPopupOpen(true);
  };

  const closeAuthPopup = () => {
    setAuthPopupOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    userContext.updateUser(null);
    userContext.updateIsVerified(false);
    navigate('/');
  };

  const handleNavigate = () => {
    navigate('/');
  };

  const handleOpenSidebar = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="logo" onClick={handleNavigate}>
        Your Logo
      </div>
      <div className="auth-buttons">
        {userContext.user ? (
          <>
            <div className="auth-link">
              {open ? (
                <SideBar open={open} handleDrawerClose={handleDrawerClose} />
              ) : (
                <button
                  className="sidebar-button"
                  onClick={handleOpenSidebar}
                >
                  Open Account
                </button>
              )}
            </div>
            <button className="auth-button" onClick={handleLogout}>
              Log Out
            </button>
          </>
        ) : (
          <>
            <button className="login-button" onClick={openAuthPopup}>
              Log In
            </button>
            <div className="auth-link">
              {open ? (
                <SideBar open={open} handleDrawerClose={handleDrawerClose} />
              ) : null}
            </div>
          </>
        )}
      </div>
      {authPopupOpen && <AuthPopup onClose={closeAuthPopup} />}
    </nav>
  );
}

export default Navbar;


