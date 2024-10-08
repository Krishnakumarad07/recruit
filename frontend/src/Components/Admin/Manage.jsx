import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Manage = () => {
  const [jobs, setJobs] = useState([]);
  const [showViewPopup, setShowViewPopup] = useState(false);
  const [showRemovePopup, setShowRemovePopup] = useState(false);
  const [selectedJob, setSelectedJob] = useState({});

  useEffect(() => {
    const getJobDetails = async () => {
      try {
        const res = await axios.get("http://localhost:8081/adminauth/JobDetails");
        setJobs(res.data.JobDetails);
      } catch (err) {
        console.log(err);
      }
    };

    getJobDetails();
  }, []);

  const handleStatusToggle = (id) => {
    setJobs(
      jobs.map((job) =>
        job._id === id ? { ...job, closed: !job.closed } : job
      )
    );
  };

  const handleViewUser  = async (id) => {
    try {
      const res = await axios.get(`http://localhost:8081/adminauth/JobDetails`);
      const job = res.data;
      setSelectedJob(job);
      setShowViewPopup(true);
    } catch (err) {
      console.log(err);
    }
  };

  const handleRemoveUser  = (id) => {
    const job = jobs.find((job) => job._id === id);
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
    try {
      const res = await axios.delete(`http://localhost:8081/adminauth/JobDetails/${selectedJob._id}`);
      setJobs(jobs.filter((job) => job._id !== selectedJob._id));
      setShowRemovePopup(false);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="jobs-management">
      <h2 id='hhh'>Job Management</h2>
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
                  <button  className='view-bt' onClick={() => handleViewUser (job._id)}>View</button>
                  <button id='remove' onClick={() => handleRemoveUser (job._id)}>Remove</button>
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
            <p>Job Title: {selectedJob.position}</p>
            <p>Org Name: {selectedJob.company?.orgname}</p>
            <p>Deadline: {new Date(selectedJob.jobDeadline).toLocaleDateString()}</p>
            <button onClick={handleViewPopupClose}>Close</button>
          </div>
        </div>
      )}

      {showRemovePopup && (
        <div className="popup">
          <div className="remove-popup">
            <h2>Remove Job</h2>
            <p>Are you sure you want to remove the job "{selectedJob.position}"?</p>
            <button onClick={handleRemoveJob}>Yes, remove</button>
            <button onClick={handleRemovePopupClose}>No, cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Manage;