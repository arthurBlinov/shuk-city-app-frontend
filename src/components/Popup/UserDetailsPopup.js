import React, { useEffect, useState } from 'react';
import '../Categories/Categories.css';
import { useUserContext } from '../User/UserContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import baseUrl from '../../utils/baseURL';
function UserDetailsPopup({ selectedUser, closeUserPopup }) {
  const userContext = useUserContext();
  const isLoggedIn = userContext.user || localStorage.getItem('userData');
  const [userDetails, setUserDetails] = useState({});
  const navigate = useNavigate();

  const handleChatClick = () => {
    navigate(`/netcraft/user/certain-chat/${selectedUser?._id}`, { state: { selectedUser: selectedUser } }); // Pass selectedUser as state
  };
  const fetchUserDetails = async() => {
    const config = {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
        "Accept": 'application/json',
        "Authorization": `Bearer ${userContext?.user?.token}`
      }
    }
      const response = await axios.get(`${baseUrl}/netcraft/user/${selectedUser?._id}`, config);
      setUserDetails(response?.data);
  }
  useEffect(() => {
      fetchUserDetails();
  }, [selectedUser])
  function uint8ArrayToBase64(uint8Array) {
    let binary = '';
    for (let i = 0; i < uint8Array?.length; i++) {
      binary += String.fromCharCode(uint8Array[i]);
    }
    return btoa(binary);
  }
  return (
    <div className="popup-overlay" style={{direction: 'rtl'}}>
      <div className="popup-content">
        <img src={`data:${userDetails?.profilePhoto?.image?.fileType};charset=utf-8;base64,${uint8ArrayToBase64(userDetails?.profilePhoto?.image?.data?.data)}`} 
        alt="" className="popup-user-photo" />
        <div className="popup-user-name">שם: {selectedUser?.name}</div>
        <div className="popup-user-email">מייל:{selectedUser.email}</div>
        {isLoggedIn ? (
          
            <button onClick={handleChatClick}>צאט עם {selectedUser?.name}</button>
        ) : null}
        <button onClick={closeUserPopup}>לסגור</button>
      </div>
    </div>
  );
}

export default UserDetailsPopup;
