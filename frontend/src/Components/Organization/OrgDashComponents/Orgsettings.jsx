import React, { useState } from 'react';
import OrgNav from '../OrgNav';
import axios from 'axios'; // Import axios
import './Orgsettings.css';

const Orgsettings = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [email, setEmail] = useState('');

  const handleForgotPasswordClick = () => {
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post('http://localhost:8081/orgauth/forgot-password', {
        email,
      });

      alert(response.data.message || 'Email sent successfully!'); // Adjust based on response structure
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Something went wrong.';
      alert(errorMessage);
    } finally {
      closePopup(); // Close the popup after submitting
    }
  };

  return (
    <>
      <OrgNav />
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
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <div className="popup-actions">
              <button onClick={closePopup}>Cancel</button>
              <button onClick={handleSubmit}>Submit</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Orgsettings;
