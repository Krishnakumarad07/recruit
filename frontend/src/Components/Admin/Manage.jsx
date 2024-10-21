import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
const Manage = () => {
  const [jobs, setJobs] = useState([]);
  const [showViewPopup, setShowViewPopup] = useState(false);
  const [showRemovePopup, setShowRemovePopup] = useState(false);
  const [selectedJob, setSelectedJob] = useState({});

  useEffect(() => {
    const getJobDetails = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8081/adminauth/JobDetails"
        );
        setJobs(res.data.JobDetails);
      } catch (err) {
        console.log(err);
      }
    };

    getJobDetails();
  }, []);

  const handleViewUser = (job) => {
    setSelectedJob(job); // Set selected job directly
    setShowViewPopup(true);
  };

  const handleRemoveUser = (job) => {
    setSelectedJob(job);
    setShowRemovePopup(true);
  };

  const handleViewPopupClose = () => {
    setShowViewPopup(false);
  };

  const handleRemovePopupClose = () => {
    setShowRemovePopup(false);
  };

  const handleRemoveJob = async () => {
    const loadingAlert = Swal.fire({
      title: "Removing Job...",
      html: "Please wait till process is completing.",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
    try {
      const res = await axios.delete(
        `http://localhost:8081/adminauth/JobDetailsDelete/${selectedJob._id}`
      );
      // alert("Job Is removed Successfully!!!!!!!");
      loadingAlert.close();
      Swal.fire({
        title: "Success!",
        text: "Job Is removed Successfully!!!!!!!",
        icon: "success",
      });
      setJobs(jobs.filter((job) => job._id !== selectedJob._id));
      setShowRemovePopup(false);
    } catch (err) {
      console.log(err);
      loadingAlert.close();
      Swal.fire({
        title: "Error!",
        text: " Internal Error on removing Job.Please try again Later",
        icon: "error",
      });
    }
  };

  return (
    <div className="jobs-management">
      <h2 id="hhh">Job Management</h2>
      <table className="jobs-table">
        <thead>
          <tr>
            <th>Job Title</th>
            <th>Org Name</th>
            <th>Deadline</th>
            <th>Manage</th>
          </tr>
        </thead>
        <tbody>
          {jobs.length > 0 ? (
            jobs.map((job) => (
              <tr key={job._id}>
                <td>{job.position}</td>
                <td>{job.company?.orgname}</td>
                <td>{new Date(job.jobDeadline).toLocaleDateString()}</td>
                <td>
                  <button
                    className="view-bt"
                    onClick={() => handleViewUser(job)}
                  >
                    View
                  </button>
                  <button id="remove" onClick={() => handleRemoveUser(job)}>
                    Remove
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No jobs available.</td>
            </tr>
          )}
        </tbody>
      </table>

      {showViewPopup && (
        <div className="popup">
          <div className="view-popup">
            <h2>View Job Details</h2>
            <p>
              <strong>Job Title:</strong> {selectedJob.position}
            </p>
            <p>
              <strong>Org Name:</strong> {selectedJob.company?.orgname}
            </p>
            <p>
              <strong>Deadline:</strong>{" "}
              {new Date(selectedJob.jobDeadline).toLocaleDateString()}
            </p>
            <p>
              <strong>Description:</strong> {selectedJob.jobDescription}
            </p>
            <p>
              <strong>Location:</strong> {selectedJob.location}
            </p>
            <p>
              <strong>Job Type:</strong> {selectedJob.jobType}
            </p>
            <p>
              <strong>Salary:</strong> {selectedJob.salary}
            </p>
            <p>
              <strong>Vacancy:</strong> {selectedJob.vacancy}
            </p>
            <p>
              <strong>Required Skills:</strong>{" "}
              {selectedJob.requiredSkills.join(", ")}
            </p>
            <button onClick={handleViewPopupClose}>Close</button>
          </div>
        </div>
      )}

      {showRemovePopup && (
        <div className="popup">
          <div className="remove-popup">
            <h2>Remove Job</h2>
            <p>
              Are you sure you want to remove the job "{selectedJob.position}"?
            </p>
            <button onClick={handleRemoveJob}>Yes, remove</button>
            <button onClick={handleRemovePopupClose}>No, cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Manage;
