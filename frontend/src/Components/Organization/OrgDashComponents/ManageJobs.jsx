import React from 'react';
import './ManageJobs.css'; 
import OrgNav from "../OrgNav.jsx";

const ManageJobs = ({ jobs }) => {
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
                <th>Created By</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobs.length > 0 ? (
                jobs.map((job, index) => (
                  <tr key={job.id}>
                    <td>{index + 1}</td>
                    <td>{job.position}</td>
                    <td>{job.company}</td>
                    <td>{job.createdBy}</td>
                    <td className="action-icons">
                      <button className="view-btn">👁️</button>
                      <button className="edit-btn">✏️</button>
                      <button className="delete-btn">🗑️</button>
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
    </>
  );
};

export default ManageJobs;
