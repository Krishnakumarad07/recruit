import React, { useState } from 'react';
import Navside from '../Dashboard/Navside';
import axios from 'axios'; // Import Axios
import './Setting.css';

const Setting = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [email, setEmail] = useState(''); // State to store the email input
  const [message, setMessage] = useState(''); // State to store success/error messages
  
  const handleForgotPasswordClick = () => {
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
    setEmail(''); // Reset email on close
    setMessage(''); // Clear any previous messages
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission

    try {
      const response = await axios.post('http://localhost:8081/userauth/forgot-password', { email });
      setMessage(response.data.message); // Display success message
      setEmail(''); // Clear email input after submission
    } catch (error) {
      setMessage(error.response.data.message); // Display error message
    }
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
            <form onSubmit={handleSubmit}>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} // Update email state
                required 
              />
              <div className="popup-actions">
                <button type="button" onClick={closePopup}>Cancel</button>
                <button type="submit">Submit</button>
              </div>
            </form>
            {message && <p>{message}</p>} {/* Display success/error message */}
          </div>
        </div>
      )}
    </>
  );
};

export default Setting;
