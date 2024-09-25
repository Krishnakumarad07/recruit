import React, { useState, useEffect } from 'react';
import './ManageJobs.css';
import OrgNav from "../OrgNav.jsx";
import axios from 'axios';

var org = localStorage.getItem("org");
org = JSON.parse(org);
console.log(org);

const ManageJobs = ({ jobs }) => {
  const [job, setJob] = useState('');
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [showViewPopup, setShowViewPopup] = useState(false);
  const [selectedJob, setSelectedJob] = useState({});

  const name = org.orgname;

  useEffect(() => {
    const fetchAddedJob = async () => {
      const id = org._id;
      try {
        const response = await axios.post('http://localhost:8081/orgauth/managejob', { id });
        console.log('API response:', response.data);
        setJob(response.data.jobs);
        console.log('State:', job);
      } catch (error) {
        console.log(error);
      }
    };
    fetchAddedJob();
  }, []);

  const handleDeleteClick = (job) => {
    console.log('Delete button clicked');
    setSelectedJob(job);
    setShowDeletePopup(true);
    console.log('showDeletePopup:', showDeletePopup);
  };

  const handleViewClick = (job) => {
    console.log('View button clicked');
    setSelectedJob(job);
    setShowViewPopup(true);
  
    // const popupContent = `
    //   <h2>Job Details</h2>
    //   <p>Job Position: ${job.position}</p>
    //   <p>Company: ${name}</p>
    //   <p>Deadline: ${new Date(job.jobDeadline).toLocaleDateString('en-GB')}</p>
    //   <!-- Add more fields as needed -->
    //   <button onClick={handleViewClose}>Close</button>
    // `;
  
    // const popupContentElement = document.querySelector('.view-popup .popup-content');
    // popupContentElement.innerHTML = ''; // Clear the content first
    // popupContentElementdangerouslySetInnerHTML = { __html: popupContent };
  };

  const handleDeleteConfirm = async () => {
    // Call API to delete the job
    const id = selectedJob.id;
    try {
      const response = await axios.post('http://localhost:8081/orgauth/deletejob', { id });
      console.log(response.data);
      // Update the job list
      setJob(job.filter((j) => j.id !== id));
    } catch (error) {
      console.log(error);
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
                <th>DeadLine</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {job.length > 0 ? (
                job.map((job, index) => (
                  <tr key={job.id}>
                    <td>{index + 1}</td>
                    <td>{job.position}</td>
                    <td>{name}</td>
                    <td>{new Date(job.jobDeadline).toLocaleDateString('en-GB')}</td>
                    <td className="action-icons">
                      <button className="view-btn" onClick={() => handleViewClick(job)}>👁️</button>
                      <button className="delete-btn" onClick={() => handleDeleteClick(job)}>🗑️</button>
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
        <div className="delete-popup-container">
          <div className="delete-popup">
            <h2>Delete Job</h2>
            <p>Are you sure you want to delete the job "{selectedJob.position}"?</p>
            <button id='btnn'onClick={handleDeleteConfirm}>Confirm</button>
            <button  id='btnn'onClick={() => setShowDeletePopup(false)}>Cancel</button>
          </div>
        </div>
      )}

 {showViewPopup && (
    <div className="view-popup-container">
      <div className="view-popup">
        <div
          className="popup-content"
          dangerouslySetInnerHTML={{
            __html: `
              <table>
                <tr>
                  <th>Job Details</th>
                </tr>
                <tr>
                  <td>Job Position:</td>
                  <td>${selectedJob.position}</td>
                </tr>
                <tr>
                  <td>Company:</td>
                  <td>${name}</td>
                </tr>
                <tr>
                  <td>Deadline:</td>
                  <td>${new Date(selectedJob.jobDeadline).toLocaleDateString('en-GB')}</td>
                </tr>
                <!-- Add more fields as needed -->
              </table>
              
            `,
          }}
        />
         <button id='cl-btn'onClick={handleViewClose}>Close</button>
      </div>
    </div>
  )}
    </>
  );
};

export default ManageJobs;