import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook, faTwitter, faLinkedin, faInstagram } from "@fortawesome/free-brands-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import "./JobList.css";
import axios from "axios";
import Swal from "sweetalert2";
var user=localStorage.getItem("user");
user=JSON.parse(user);
const JobList = () => {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState({});
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const check = async () => {
      try {
        const res = await axios.put("http://localhost:8081/orgauth/isOpOrg");
        console.log(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    check();
  }, []);

  useEffect(() => {
    const fetchJobList = async () => {
      try {
        const response = await axios.get("http://localhost:8081/orgauth/joblist");
        setJobs(response.data.joblist || []);
      } catch (error) {
        console.error("Error fetching job list:", error);
      }
    };
    fetchJobList();
  }, []);

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const handleConfirmLogout = () => {
    navigate("/");
    setShowLogoutModal(false);
  };

  const handleCancelLogout = () => {
    setShowLogoutModal(false);
  };

  const handleApplyClick = (job) => {
    setShowApplyModal(true);
    setSelectedJob(job);
  };

  const handleApplyModalClose = () => {
    setShowApplyModal(false);
    setSelectedJob({});
  };

  const handleApplyFormSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    formData.append("jobType", selectedJob.jobType);
    formData.append("position", selectedJob.position);
    formData.append("orgname", selectedJob.company.orgname); // Adjusted to match the backend
    // Show loading alert
    const loadingAlert = Swal.fire({
      title: 'Submitting Application...',
      html: 'Please wait while we process your application.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
    try {
      const response = await axios.post("http://localhost:8081/jobauth/applyjob", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      loadingAlert.close();

      Swal.fire({
        title: 'Success!',
        text: 'You have applied successfully.',
        icon: 'success',
      });
      console.log(response.data);
      handleApplyModalClose();
    } catch (error) {
      loadingAlert.close();
      console.error("Error submitting application:", error);
      Swal.fire({
        title: 'Error!',
        text: 'Failed to submit your application. Please try again.',
        icon: 'error',
      });
    }
  };

  return (
    <>
      <div className="main-content">
        <div id="home1" className="welcome-line">
          <p>Welcome to Our Job Portal, <span>Recruit...</span></p>
          <FontAwesomeIcon icon={faFacebook} />
          <FontAwesomeIcon icon={faTwitter} />
          <FontAwesomeIcon icon={faLinkedin} />
          <FontAwesomeIcon icon={faInstagram} />
        </div>

        <div className="navbarjobs">
          <nav className="navbar5" id="ten">
            <img id="pro-icon1" src="pro-logo.png" alt="logo" />
            <h1>Recruit</h1>
            <ul className="navbar-list1">
              <li className="nav-list-items1">
                <Link to="/profile">Dashboard</Link>
              </li>
              <li className="nav-list-items1" onClick={handleLogoutClick}>
                <Link to="#">Logout</Link>
              </li>
            </ul>
          </nav>

          {showLogoutModal && (
            <div className="modal">
              <div className="modal-content">
                <h3>Confirm Logout</h3>
                <p>Are you sure you want to logout?</p>
                <button id="yes" onClick={handleConfirmLogout}>Yes</button>
                <button onClick={handleCancelLogout}>No</button>
              </div>
            </div>
          )}
        </div>

        <h2 id="h3">Job Listings</h2>

        <div className="job-list-container">
          {jobs.length > 0 ? (
            jobs.map((job) => (
              <div className="job-item" key={`${job.position}-${job.company.orgname}`}>
                <h3>{job.position}</h3>
                <p><strong>Company:</strong> {job.company.orgname}</p>
                <p><strong>Location:</strong> {job.location}</p>
                <p><strong>Job Type:</strong> {job.jobType}</p>
                <p><strong>Job Description:</strong> {job.jobDescription}</p>
                <button className="btn" onClick={() => handleApplyClick(job)}>Apply now</button>
              </div>
            ))
          ) : (
            <p>No jobs available.</p>
          )}
        </div>

        {showApplyModal && (
          <div className={`hero ${selectedJob.position.toLowerCase().replace(/\s+/g, "-")}`}>
            <div className="hero-content">
              <div className="spiderman">
              <h3>Apply for <span> {selectedJob.position}</span></h3>
              <p><strong>Company:</strong> {selectedJob.company.orgname}</p>
              <p><strong>Location:</strong> {selectedJob.location}</p>
              <p><strong>Job Type:</strong> {selectedJob.jobType}</p>
              <p><strong>Job Description:</strong> {selectedJob.jobDescription}</p>
              </div>
              <form onSubmit={handleApplyFormSubmit}>
                <label className="label">Name:</label><br />
                <input type="text" name="name" required /><br />
                <label className="label">Email:</label><br />
                <input type="email" name="email" value={user.email} disable/><br />
                <label className="label">Gender:</label><br />
                <select name="gender" required>
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Not to Say">Not to Say</option>
                </select><br />
                <label className="label">Date of Birth:</label><br />
                <input type="date" name="date" required /><br />
                <label className="label">Address:</label><br />
                <textarea name="address" required></textarea><br />
                <label className="label">State:</label><br />
                <input type="text" name="state" required /><br />
                <label className="label">Country:</label><br />
                <input type="text" name="country" required /><br />
                <label className="label">Education Qualification:</label><br />
                <input type="text" name="education" required /><br />
                <label className="label">Percentage:</label><br />
                <input type="text" name="percentage" required /><br />
                <label className="label">Resume:</label><br />
                <input type="file" name="file" required /><br />
                <label className="label">Phone Number:</label><br />
                <input type="tel" name="phone" required /><br />
                <button type="submit" className="submit-button">Apply</button>
                <button type="button" className="close-button" onClick={handleApplyModalClose}>Close</button>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default JobList;
