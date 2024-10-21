import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import React, { useState } from "react";
import axios from "axios";
const Adlogin = () => {
  const [Form, setForm] = useState({
    email: "",
    password: "",
  });

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
      title: "Logging In",
      html: "Please wait till process is completing.",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    axios
      .post("http://localhost:8081/adminauth/login", Form)

      .then((res) => {
        console.log(res.data);
        localStorage.setItem("adm", JSON.stringify(res.data));
        loadingAlert.close();
        navigate("/admindash");
      })
      .catch((error) => {
        // alert("Check that the username or password is correct.");
        loadingAlert.close();
        Swal.fire({
          title: "Error!",
          text: " Check that the username or password is correct.",
          icon: "error",
        });
        console.error("Login error:", error);
      });
  };
  return (
    <>
      <div className="body">
        <div className="login-wrapper">
          <div className="login-container-user">
            <div className="login-form">
              <h3>Admin Login</h3>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <br />
                  <input
                    id="in"
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
                {/* <p id='forget' onClick={handleForgotPasswordClick}>Forgot Password?</p> */}
                <button id="btn-login" type="submit">
                  Login
                </button>
              </form>
              {/* <p>
                                Don't have an account? <a href=""><Link to="/sign">Create Account</Link></a>
                            </p> */}
            </div>

            <div className="login-image">
              <img src="backdrop.png" alt="Login Illustration" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Adlogin;
