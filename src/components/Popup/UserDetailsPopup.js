import React from 'react';
import '../Categories/Categories.css';
import { useUserContext } from '../User/UserContext';
import { useNavigate } from 'react-router-dom';
function UserDetailsPopup({ selectedUser, closeUserPopup }) {
  const userContext = useUserContext();
  const isLoggedIn = userContext.user || localStorage.getItem('userData');
  const navigate = useNavigate();

  const handleChatClick = () => {
    navigate(`/netcraft/user/certain-chat/${selectedUser?._id}`, { state: { selectedUser: selectedUser } }); // Pass selectedUser as state
  };
  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <img src={selectedUser?.profilePhoto} alt="" className="popup-user-photo" />
        <div className="popup-user-name">name: {selectedUser?.name}</div>
        <div className="popup-user-email">email: {selectedUser.email}</div>
        <div className="popup-user-blocked">ifBlocked: {selectedUser.ifBlocked ? 'yes' : 'no'}</div>
        {isLoggedIn ? (
          
            <button onClick={handleChatClick}>Chat with {selectedUser?.name}</button>
        ) : null}
        <button onClick={closeUserPopup}>Close</button>
      </div>
    </div>
  );
}

export default UserDetailsPopup;
