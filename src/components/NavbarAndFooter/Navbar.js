import React, { useContext, useState } from 'react';
import './Navbar.css';
import AuthPopup from '../Popup/AuthPopup';
import { useUserContext } from '../User/UserContext';
import { useNavigate, Link } from 'react-router-dom'; // Import Link from react-router-dom

function Navbar() {
  const [authPopupOpen, setAuthPopupOpen] = useState(false);
  const userContext = useUserContext(); // Use the user context
  const navigate = useNavigate(); 
  const openAuthPopup = () => {
    setAuthPopupOpen(true);
  };

  const closeAuthPopup = () => {
    setAuthPopupOpen(false);
  };

  const handleLogout = () => {
    // Clear user data from local storage and update the user context
    localStorage.removeItem('user');
    userContext.updateUser(null);
    userContext.updateIsVerified(false);
    navigate('/');
  };
  const handleNavigate = () => {
    navigate('/')
  }
  return (
    <nav className="navbar">
      <div className="logo" onClick={handleNavigate}>Your Logo</div>
      <div className="auth-buttons">
        {/* Show "Log Out" when the user is logged in */}
        {userContext.user ? (
          <>
            <Link to={`/netcraft/user/${userContext?.user?._id}`} className="auth-link">My Account</Link> {/* Link to My Account */}
            <button className="auth-button" onClick={handleLogout}>
              Log Out
            </button>
          </>
        ) : (
          <button className="auth-button" onClick={openAuthPopup}>
            Log In
          </button>
        )}
      </div>
      {authPopupOpen && <AuthPopup onClose={closeAuthPopup} />}
    </nav>
  );
}

export default Navbar;

