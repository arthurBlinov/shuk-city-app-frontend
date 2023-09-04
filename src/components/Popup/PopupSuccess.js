import React from 'react';
import './PopupSuccess.css';

function PopupSuccess({ onClose }) {
  return (
    <div className="popup-success-overlay">
      <div className="popup-success">
        <div className="success-message">יש, נכנסת</div>
        <button className="close-button" onClick={onClose}>
         לסגור
        </button>
      </div>
    </div>
  );
}

export default PopupSuccess;
