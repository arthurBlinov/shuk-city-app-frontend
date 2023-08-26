import React, { useState } from 'react';
import { useUserContext } from '../User/UserContext';
import './AuthPopup.css';
import axios from 'axios';
import PopupSuccess from './PopupSuccess';
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
        const response = await axios.post('https://forum-netcraft-backend-0ea87a3f4f22.herokuapp.com/netcraft/user/login', {
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
        const response = await axios.post('https://forum-netcraft-backend-0ea87a3f4f22.herokuapp.com/netcraft/user/registrate', {
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
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {!isSignIn && (
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          )}
          <button type="submit">{isSignIn ? 'Sign In' : 'Sign Up'}</button>
        </form>
        <div className="toggle-mode">
          {isSignIn ? (
            <>
              Don't have an account?{' '}
              <span className="toggle-link" onClick={toggleMode}>
                Sign Up
              </span>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <span className="toggle-link" onClick={toggleMode}>
                Sign In
              </span>
            </>
          )}
        </div>
        <button className="close-button" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}

export default AuthPopup;
