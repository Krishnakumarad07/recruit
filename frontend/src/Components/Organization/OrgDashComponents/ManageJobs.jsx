import React, { useState, useEffect } from "react";
import "./ManageJobs.css";
import OrgNav from "../OrgNav.jsx";
import axios from "axios";
import Swal from "sweetalert2";

const ManageJobs = ({ jobs }) => {
  const [jobList, setJobList] = useState([]);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [showViewPopup, setShowViewPopup] = useState(false);
  const [selectedJob, setSelectedJob] = useState({});

  const org = JSON.parse(localStorage.getItem("org"));
  const name = org.orgname;

  useEffect(() => {
    const fetchAddedJob = async () => {
      const id = org._id;
      try {
        const response = await axios.post(
          "http://localhost:8081/orgauth/managejob",
          { id }
        );
        console.log("API response:", response.data);
        setJobList(response.data.jobs);
      } catch (error) {
        console.log(error);
      }
    };
    fetchAddedJob();
  }, []);

  const handleDeleteClick = (job) => {
    setSelectedJob(job);
    setShowDeletePopup(true);
  };

  const handleViewClick = (job) => {
    setSelectedJob(job);
    setShowViewPopup(true);
  };

  const handleDeleteConfirm = async () => {
    const id = selectedJob._id;
    console.log(id); // Use _id for deletion
    const loadingAlert = Swal.fire({
      title: "Removing Job...",
      html: "Please wait till process is completing.",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
    try {
      await axios.delete(`http://localhost:8081/jobauth/deletejob/${id}`);
      setJobList(jobList.filter((j) => j._id !== id)); // Update job list
      loadingAlert.close();

      Swal.fire({
        title: "Success!",
        text: "The Job has been deleted Successfully.",
        icon: "success",
      });
    } catch (error) {
      loadingAlert.close();
      console.error("Error on Removing application:", error);
      Swal.fire({
        title: "Error!",
        text: "Failed to Remove the Job. Please try again.",
        icon: "error",
      });
    }
    setShowDeletePopup(false);
  };

  const handleViewClose = () => {
    setShowViewPopup(false);
  };

  return (
    <>
      <OrgNav />
      <div className="manage-jobs-container">
        <div className="table-container">
          <h2>Manage Jobs</h2>
          <table className="job-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Job Position</th>
                <th>Company</th>
                <th>Deadline</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobList.length > 0 ? (
                jobList.map((job, index) => (
                  <tr key={job._id}>
                    <td>{index + 1}</td>
                    <td>{job.position}</td>
                    <td>{name}</td>
                    <td>
                      {new Date(job.jobDeadline).toLocaleDateString("en-GB")}
                    </td>
                    <td className="action-icons">
                      <button
                        id="view"
                        className="view-bt"
                        onClick={() => handleViewClick(job)}
                      >
                        view
                      </button>
                      <button
                        id="remove"
                        className="remove-bt"
                        onClick={() => handleDeleteClick(job)}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5">No jobs available.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showDeletePopup && (
        <div className="delete-popup-containe">
          <div className="remove-popup">
            <h2>Delete Job</h2>
            <p>
              Are you sure you want to delete the job "{selectedJob.position}"?
            </p>
            <button id="btnn" onClick={handleDeleteConfirm}>
              Confirm
            </button>
            <button id="btnn" onClick={() => setShowDeletePopup(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {showViewPopup && (
        <div className="view-popup-containe">
          <div className="view-popup">
            <h2>Job Details</h2>
            <table>
              <tbody>
                <tr>
                  <td>Job Position:</td>
                  <td>{selectedJob.position}</td>
                </tr>
                <tr>
                  <td>Company:</td>
                  <td>{name}</td>
                </tr>
                <tr>
                  <td>Location:</td>
                  <td>{selectedJob.location}</td>
                </tr>
                <tr>
                  <td>Job Type:</td>
                  <td>{selectedJob.jobType}</td>
                </tr>
                <tr>
                  <td>Salary:</td>
                  <td>{selectedJob.salary}</td>
                </tr>
                <tr>
                  <td>Deadline:</td>
                  <td>
                    {new Date(selectedJob.jobDeadline).toLocaleDateString(
                      "en-GB"
                    )}
                  </td>
                </tr>
                <tr>
                  <td>Job Description:</td>
                  <td>{selectedJob.jobDescription}</td>
                </tr>
                <tr>
                  <td>Required Skills:</td>
                  <td>{selectedJob.requiredSkills.join(", ")}</td>
                </tr>
                <tr>
                  <td>Facilities:</td>
                  <td>{selectedJob.jobFacilities.join(", ")}</td>
                </tr>
                <tr>
                  <td>Vacancy:</td>
                  <td>{selectedJob.vacancy}</td>
                </tr>
              </tbody>
            </table>
            <button id="cl-btn" onClick={handleViewClose}>
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ManageJobs;
