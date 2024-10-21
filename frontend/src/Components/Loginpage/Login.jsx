import { Link, useNavigate } from 'react-router-dom';
import './Login.css';
import React, { useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import Swal from 'sweetalert2';

function Login() {
  const [Form, setForm] = useState({
    email: "",
    password: "",
  });
  const [showPopup, setShowPopup] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    
    setForm({
      ...Form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const loadingAlert = Swal.fire({
      title: "Logging In...",
      html: "Please wait while we process your application.",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    axios
      .post("http://localhost:8081/userauth/login", Form)
      .then((res) => {
        if (res.data.token) {
          const token = res.data.token;
          loadingAlert.close();
          // Decode the token to get user information
          const user = jwtDecode(token); // Decode the token
          console.log(user); // This will show the decoded user info in console

          // Save user information to localStorage
          localStorage.setItem("user", JSON.stringify(user));
          
          // Navigate to profile page
          navigate("/profile");
          window.location.reload();
      } else {
          // alert("Token not received.");
          loadingAlert.close();
          // console.error("Error submitting application:", error);
          Swal.fire({
            title: "Error!",
            text: "Token not received.",
            icon: "error",
          });
      }
  })
      .catch((error) => {

        // alert("Check that the username or password is correct");
        loadingAlert.close();
          Swal.fire({
            title: "Error!",
            text: "Check that the username or password is correct",
            icon: "error",
          });
        console.error("Login error:", error);
      });
  };

  const handleForgotPasswordClick = () => {
    setShowPopup(true);
  };

  const handleForgotPasswordSubmit = () => {
    axios
      .post("http://localhost:8081/userauth/forgot-password", { email: forgotEmail })
      .then((res) => {
        alert("Email is correct. Please check your inbox.");
        setShowPopup(false);
      })
      .catch((error) => {
        alert("The email address you entered is not correct.");
        console.error("Forgot Password error:", error);
      });
  };

  return (
    <>
      <div className="body">
        <div className="login-wrapper">
          <div className="login-container-user">
            <div className="login-form">
              <h3>Login</h3>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="email">Email</label><br />
                  <input id='in'
                    type="email"
                    name="email"
                    placeholder="Email@example.com"
                    value={Form.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="password">Password</label> <br />
                  <input id='in'
                    type="password"
                    name="password"
                    placeholder="@#$KUadeg"
                    value={Form.password}
                    onChange={handleChange}
                    required
                  />
                </div>
                <p id='forget' onClick={handleForgotPasswordClick}>Forgot Password?</p>
                <button id='btn-login' type="submit">Login</button>
              </form>
              <p>
                Don't have an account? <a href=""><Link to="/sign">Create Account</Link></a>
              </p>
            </div>

            <div className="login-image">
              <img src="backdrop.png" alt="Login Illustration" />
            </div>
          </div>
        </div>
      </div>

      {showPopup && (
        <div className="popup1">
          <div className="popup-inner1">
            <h3>Forgot Password</h3>
            <input
              type="email"
              placeholder="Enter your email"
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
              required
            />
            <button onClick={handleForgotPasswordSubmit}>Submit</button>
            <button onClick={() => setShowPopup(false)}>Close</button>
          </div>
        </div>
      )}
    </>
  );
}

export default Login;