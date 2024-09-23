import React, { useState } from 'react';
import OrgNav from '../OrgNav';
import './Orgsettings.css';

const Orgsettings = () => {
  const [showPopup, setShowPopup] = useState(false);

  const handleForgotPasswordClick = () => {
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  return (
    <>
      <OrgNav />
      <div className="settings-card">
        <div className="setting-img">
          <img src="forgot.png" alt="img" />
        </div>
        <h2>Forgot Your Password?</h2>
        <button onClick={handleForgotPasswordClick}>Forgot Password</button>
      </div>

      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <h3>Forgot Password</h3>
            <p>Please enter your email to reset your password.</p>
            <input type="email" placeholder="Enter your email" />
            <div className="popup-actions">
              <button onClick={closePopup}>Cancel</button>
              <button>Submit</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Orgsettings;
