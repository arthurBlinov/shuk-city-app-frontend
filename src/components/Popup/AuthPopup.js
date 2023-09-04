import React, { useState } from 'react';
import { useUserContext } from '../User/UserContext';
import './AuthPopup.css';
import axios from 'axios';
import PopupSuccess from './PopupSuccess';
import baseUrl from '../../utils/baseURL';
function AuthPopup({ onClose }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isSignIn, setIsSignIn] = useState(true);
  const [showPopupSuccess, setShowPopupSuccess] = useState(false); 

  const { updateUser, updateIsVerified } = useUserContext(); 

  const toggleMode = () => {
    setIsSignIn(!isSignIn);
  };
    const signIn = async(email, password) => {
        const config = {
            headers:{
                "Access-Control-Allow-Origin": "*",
                "Content-Type": "application/json",
                "Accept": 'application/json',
            }
        }
        const response = await axios.post(`${baseUrl}/netcraft/user/login`, {
            email: email,
            password: password
        }, config)
        return response;
    }
    const signUp = async(email, name, password) => {
        const config = {
            headers:{
                "Access-Control-Allow-Origin": "*",
                "Content-Type": "application/json",
                "Accept": 'application/json',
            }
        }
        const response = await axios.post(`${baseUrl}/netcraft/user/registrate`, {
            name: name,
            email: email,
            password: password
        }, config)
        return response;
    }
    const handleLoginSuccess = () => {
      setShowPopupSuccess(true);
    };
  
    const handleClosePopupSuccess = () => {
      setShowPopupSuccess(false);
      onClose(); // Close the AuthPopup component
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
  
      if (isSignIn) {
        try {
          const response = await signIn(email, password);
          const { data } = response;
  
          updateUser(data);
          updateIsVerified(data.isAccountVerified);
  
          handleLoginSuccess();
        } catch (error) {
          console.error('Sign-in error:', error);
        }
      } else {
        try {
          const response = await signUp(email, name, password);
          const { data } = response;
  
          updateUser(data);
          updateIsVerified(data.isAccountVerified);
  
          handleLoginSuccess();
        } catch (error) {
          console.error('Log-in error:', error);
        }
      }
    };
  

  return (
    <div className="auth-popup-overlay">
      <div className="auth-popup">
      {showPopupSuccess && <PopupSuccess onClose={handleClosePopupSuccess} />}
        <div className="auth-header">Sign In</div>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="מייל"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="סיסמה"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          
          <button type="submit">להיכנס</button>
        </form>
        
        <button className="close-button" onClick={onClose}>
          לסגור
        </button>
      </div>
    </div>
  );
}

export default AuthPopup;
