import React from 'react';
import './PopupSuccess.css';

function PopupSuccess({ onClose }) {
  return (
    <div className="popup-success-overlay">
      <div className="popup-success">
        <div className="success-message">Logged in successfully!</div>
        <button className="close-button" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}

export default PopupSuccess;
