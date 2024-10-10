import React, { useState, useEffect } from "react";
import Navside from "./Navside";
import "./ApplyJob.css";
import axios from "axios";

const ApplyJob = () => {
  const [showViewPopup, setShowViewPopup] = useState(false);
  const [jobToView, setJobToView] = useState(null);
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
      const user = localStorage.getItem("user");
      const parsedUser = JSON.parse(user);

      if (parsedUser && parsedUser.email) {
        try {
          const response = await axios.get(
            `http://localhost:8081/jobauth/AppliedJob?email=${parsedUser.email}`
          );
          console.log(response.data);
          setJobs(response.data); // Assuming response.data is an array
        } catch (err) {
          console.error("Error fetching jobs:", err);
        }
      }
    };

    fetchJobs();
  }, []);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleView = (job) => {
    setJobToView(job);
    setShowViewPopup(true);
  };

  const handleCloseView = () => {
    setShowViewPopup(false);
  };

  return (
    <>
      <Navside />
      <div className="users-management">
        <h2 id="mm">Applied Jobs</h2>
        {jobs.length === 0 ? (
          <div>No jobs applied.</div>
        ) : (
          <table className="users animate__animated animate__slideInUp">
            <thead>
              <tr>
                <th>Job Title</th>
                <th>Organization Name</th>
                <th>Applied Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr key={job._id} className="animate__animated animate__fadeIn">
                  <td>{job.position}</td>
                  <td>{job.Company?.orgname}</td>
                  <td>{formatDate(job.appliedDate)}</td>
                  <td>{job.status}</td>
                  <td>
                    <button
                      id="view"
                      className="view-bt"
                      onClick={() => handleView(job)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {showViewPopup && jobToView && (
          <div className="popup-boxie">
            <div className="view-popup">
              <h2>{jobToView.position}</h2>
              <p>Company: {jobToView.Company?.orgname || "No Organization"}</p>
              <p>Email: {jobToView.email}</p>
              <p>Phone: {jobToView.phone}</p>
              <p>Education Qualification: {jobToView.educationqualification}</p>
              <p>Percentage: {jobToView.percentage?.$numberDecimal}</p>
              <p>Job Type: {jobToView.jobType}</p>
              <p>Address: {jobToView.address}</p>
              <p>State: {jobToView.state}</p>
              <p>Country: {jobToView.country}</p>
              <p>Applied Date: {formatDate(jobToView.appliedDate)}</p>
              <p>Status: {jobToView.status}</p>
              <p>Resume: <a href={jobToView.resume} id="hyperres" target="_blank">Click Here</a></p>
              {jobToView.status === "HR" && (
                <>
                  <p>
                    <strong>Meeting Link:</strong> {jobToView.hrRoundLink}
                  </p>
                  <p>
                    <strong>Date and Time:</strong>{" "}
                    {new Date(jobToView.hrRoundDateAndTime).toLocaleString()}
                  </p>
                </>
              )}
              <button onClick={handleCloseView}>Close</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ApplyJob;
