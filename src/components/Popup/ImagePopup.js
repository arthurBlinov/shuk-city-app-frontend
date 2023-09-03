import React from 'react';
import '../Categories/Categories.css';
function ImagePopup({ handlePopup, url }) {
  function uint8ArrayToBase64(uint8Array) {
    let binary = '';
    for (let i = 0; i < uint8Array.length; i++) {
      binary += String.fromCharCode(uint8Array[i]);
    }
    return btoa(binary);
  }
 return(
    <div className="popup-overlay">
          <div className="popup-content">
            <img src={`data:${url?.fileType};charset=utf-8;base64,${uint8ArrayToBase64(url?.image?.data?.data)}`} alt="Popup" />
            <button onClick={handlePopup}>Close</button>
          </div>
        </div>
 );
}

export default ImagePopup;
