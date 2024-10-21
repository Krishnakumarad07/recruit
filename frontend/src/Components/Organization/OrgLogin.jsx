import { Link, useNavigate } from "react-router-dom";
import "./OrgLogin.css";
import React, { useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import Swal from "sweetalert2";

function OrgLogin() {
  const [Form, setForm] = useState({
    orgname: "",
    org_email: "",
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
      .post("http://localhost:8081/orgauth/login", Form)
      .then((res) => {
        const token = res.data.token;
        const org = jwtDecode(token, res.data.JWT_SECRET).orgdetails;
        console.log(res.data.message, org);
        loadingAlert.close();
        localStorage.setItem("org", JSON.stringify(org));
        navigate("/orgprofile");
        window.location.reload();
      })
      .catch((error) => {
        // alert("Check that the username or password is correct.");
        loadingAlert.close();
        Swal.fire({
          title: "Error!",
          text: "Check that the username or password is correct.",
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
      .post("http://localhost:8081/orgauth/forgot-password", {
        email: forgotEmail,
      })
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
          <div className="login-container">
            <div className="login-form">
              <h3>Org Login</h3>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="Orgname">Orgname</label>
                  <br />
                  <input
                    id="in"
                    type="text"
                    name="orgname"
                    placeholder="Microsoft"
                    value={Form.orgname}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <br />
                  <input
                    id="in"
                    type="email"
                    name="org_email"
                    placeholder="Email@example.com"
                    value={Form.org_email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <br />
                  <input
                    id="in"
                    type="password"
                    name="password"
                    placeholder="@#$KUadeg"
                    value={Form.password}
                    onChange={handleChange}
                    required
                  />
                </div>
                <p id="forget" onClick={handleForgotPasswordClick}>
                  Forgot Password?
                </p>
                <button id="btn-login" type="submit">
                  Login
                </button>
              </form>
              <p id="p">
                Don't have an account?{" "}
                <a href="">
                  <Link to="/orgsignup">Create Org Account</Link>
                </a>
              </p>
            </div>

            <div className="login-image">
              <img src="backdrop.png" alt="Login Illustration" />
            </div>
          </div>
        </div>
      </div>

      {showPopup && (
        <div className="popup">
          <div className="popup-inner">
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

export default OrgLogin;
