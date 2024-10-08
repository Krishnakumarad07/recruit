import React, { useState } from 'react';
import Navside from '../Dashboard/Navside';
import './Setting.css';
var details = localStorage.getItem("user");
details = JSON.parse(details);
const Setting = () => {
  const [showPopup, setShowPopup] = useState(false);

  const handleForgotPasswordClick = () => {
    
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  return (
    <>
      <Navside />
      <div className="settings-card">
        <div className="setting-img">
          <img src="forgot.png" alt="img" />
        </div>
        <h2>Remember Your Password?</h2>
        <button onClick={handleForgotPasswordClick}>Click here</button>
      </div>

      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <h3>Password</h3>
            <p>Please enter your email to know your password.</p>
            <input type="email" value={details.email}/>
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

export default Setting;
