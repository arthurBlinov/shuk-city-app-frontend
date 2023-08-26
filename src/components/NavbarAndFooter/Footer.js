import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>&copy; 2023 Your Company. All rights reserved.</p>
        <div className="social-icons">
          {/* <a href="#" target="_blank" rel="noopener noreferrer"> */}
            <i className="fab fa-facebook"></i>
          {/* </a> */}
          {/* <a href="#" target="_blank" rel="noopener noreferrer"> */}
            <i className="fab fa-twitter"></i>
          {/* </a> */}
          {/* <a href="#" target="_blank" rel="noopener noreferrer"> */}
            <i className="fab fa-instagram"></i>
          {/* </a> */}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
