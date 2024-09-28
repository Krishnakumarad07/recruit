import React, { useState } from 'react';
import Navside from './Navside';
import './ApplyJob.css';

const ApplyJob = () => {
  const [showViewPopup, setShowViewPopup] = useState(false);
  const [showRemovePopup, setShowRemovePopup] = useState(false);
  const [userIdToRemove, setUserIdToRemove] = useState(null);
  const [jobToView, setJobToView] = useState(null);
  const jobs = [
    { id: 1, title: 'Job 1', company: 'Company 1', appliedDate: '2022-01-01', status: 'Applied' },
    { id: 2, title: 'Job 2', company: 'Company 2', appliedDate: '2022-01-02', status: 'Applied' },
    { id: 3, title: 'Job 3', company: 'Company 3', appliedDate: '2022-01-03', status: 'Applied' },
    { id: 1, title: 'Job 1', company: 'Company 1', appliedDate: '2022-01-01', status: 'Applied' },
    { id: 2, title: 'Job 2', company: 'Company 2', appliedDate: '2022-01-02', status: 'Applied' },
    { id: 3, title: 'Job 3', company: 'Company 3', appliedDate: '2022-01-03', status: 'Applied' },
  ];

  const handleRemove = (userId) => {
    setUserIdToRemove(userId);
    setShowRemovePopup(true);
  };

  const handleView = (job) => {
    setJobToView(job);
    setShowViewPopup(true);
  };

  const handleConfirmRemove = () => {
    // Add code here to remove the user from the database
    console.log(`User ${userIdToRemove} removed!`);
    setShowRemovePopup(false);
  };

  const handleCancelRemove = () => {
    setShowRemovePopup(false);
  };

  const handleCloseView = () => {
    setShowViewPopup(false);
  };

  return (
    <>
      <Navside />
      <div className="users-management">
        <h2 id='mm'>Applied Jobs</h2>
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
              <tr key={job.id} className="animate__animated animate__fadeIn">
                <td>{job.title}</td>
                <td>{job.company}</td>
                <td>{job.appliedDate}</td>
                <td>{job.status}</td>
                <td>
                  <button id='view' className="view-bt" onClick={() => handleView(job)}>View</button>
                  <button id='remove' className="remove-btn" onClick={() => handleRemove(job.id)}>Remove</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {showViewPopup && (
          <div className="popup-boxie">
            <div className="job-view-popup">
              <h2>{jobToView.title}</h2>
              <p>Company: {jobToView.company}</p>
              <p>Applied Date: {jobToView.appliedDate}</p>
              <p>Status: {jobToView.status}</p>
              <button onClick={handleCloseView}>Close</button>
            </div>
          </div>
        )}

        {showRemovePopup && (
          <div className="popup-boxie">
            <div className="remove-popup">
              <p>Are you sure you want to cancel the job application?</p>
              <button onClick={handleConfirmRemove}>Yes, remove</button>
              <button onClick={handleCancelRemove}>Cancel</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ApplyJob;