import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Signup.css";
import axios from "axios";
import Swal from "sweetalert2";
const Signup = () => {
  const [form, setForm] = useState({
    orgname: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const loadingAlert = Swal.fire({
      title: "Submitting Application...",
      html: "Please wait while we process your application.",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
    const { orgname, email, password, confirmPassword } = form;

    if (password !== confirmPassword) {
      loadingAlert.close();
      alert("Passwords do not match!");
      return;
    }

    // Make the POST request
    axios
      .post("http://localhost:8081/orgauth/signup", {
        orgname,
        org_email: email,
        password,
      })
      .then((res) => {
        console.log("Response:", res.data);
        localStorage.setItem("token", res.data.token);
        loadingAlert.close();
        Swal.fire({
          title: "Success!",
          text: "Account created successfully!",
          icon: "success",
        });
        // alert('Account created successfully!');
        navigate("/orglogin");
      })
      .catch((err) => {
        console.error("Error:", err.response ? err.response.data : err.message);
        // alert("Failed to create account. Please try again.");
        loadingAlert.close();
        Swal.fire({
          title: "Error!",
          text:
            err.response?.data?.message ||
            "Failed to create account. Please try again.",
          icon: "error",
        });
      });
  };

  return (
    <div className="body">
      <div className="signup-page">
        <div className="form-container">
          <div className="sign-form">
            <h3>Create Org Account</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group1">
                <label>Org name</label>
                <input
                  id="in"
                  type="text"
                  name="orgname"
                  value={form.orgname}
                  onChange={handleChange}
                  placeholder="Type Here"
                  required
                />
              </div>
              {/* <div className="form-group1">
                                <label>Email</label>
                                <input id='in'
                                    type="email"
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    placeholder="Email@example.com"
                                    required
                                />
                            </div>
                            <div className="form-group1">
                                <label>Email</label>
                                <input id='in'
                                    type="email"
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    placeholder="Email@example.com"
                                    required
                                />
                            </div> */}
              <div className="form-group1">
                <label>Email</label>
                <input
                  id="in"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Email@example.com"
                  required
                />
              </div>
              <div className="form-group1">
                <label>Password</label>
                <input
                  id="in"
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Type Here"
                  required
                />
              </div>
              <div className="form-group1">
                <label>Confirm Password</label>
                <input
                  id="in"
                  type="password"
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="Type Here"
                  required
                />
              </div>
              <button id="btn-signup" type="submit">
                Register
              </button>
            </form>
            <p>
              Already have an account? <Link to="/orglogin">Login Now</Link>
            </p>
          </div>
        </div>
        <div className="login-image">
          <img src="backdrop.png" alt="Login Illustration" />
        </div>
      </div>
    </div>
  );
};

export default Signup;
