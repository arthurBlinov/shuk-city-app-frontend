import React from 'react';
import '../Categories/Categories.css';

function ImagePopup({ handlePopup, url }) {
 return(
    <div className="popup-overlay">
          <div className="popup-content">
            <img src={url} alt="Popup" />
            <button onClick={handlePopup}>Close</button>
          </div>
        </div>
 );
}

export default ImagePopup;
