import React, { useState } from 'react';
import OrgNav from '../OrgNav'
import './Application.css'
// import axios from "axios";

const Application = () => {
  const [jobs, setJobs] = useState([
    { id: 1, userName: 'John Doe', email: 'john@example.com', phone: '123-456-7890', resume: 'resume.pdf', status: '', closed: false },
    { id: 2, userName: 'Jane Doe', email: 'jane@example.com', phone: '987-654-3210', resume: 'resume.pdf', status: '', closed: true },
    { id: 3, userName: 'Bob Smith', email: 'bob@example.com', phone: '555-123-4567', resume: 'resume.pdf', status: '', closed: false },
  ]);

  const [statusDropdown, setStatusDropdown] = useState(null);

  const handleStatusToggle = (jobId) => {
    setJobs((prevJobs) =>
      prevJobs.map((job) => {
        if (job.id === jobId) {
          return { ...job, closed: !job.closed };
        }
        return job;
      })
    );
  };

  const handleStatusChange = (jobId, newStatus) => {
    setJobs((prevJobs) =>
      prevJobs.map((job) => {
        if (job.id === jobId) {
          return { ...job, status: newStatus };
        }
        return job;
      })
    );
    setStatusDropdown(null); // Close the dropdown menu after selecting an option
  };

  const handleResumeClick = (resume) => {
    // Add code to handle resume click here
    console.log(`Resume clicked: ${resume}`);
  };

  return (
    <>
      {/* <OrgNav /> */}
      <div className="job-management-container">
        <h2 id='job-management-header'>Job Management</h2>
        <table className="job-table">
          <thead>
            <tr>
              <th>User Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Resume</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job) => (
              <tr key={job.id}>
                <td>{job.userName}</td>
                <td>{job.email}</td>
                <td>{job.phone}</td>
                <td>
                  <button onClick={() => handleResumeClick(job.resume)} className="view-resume-btn">View Resume</button>
                </td>
                <td>
                  <div className="status-selector">
                    <button
                      onClick={() => setStatusDropdown(job.id)}
                      className="status-selector-btn"
                    >
                      {job.status || 'Select Status'}
                    </button>
                    {statusDropdown === job.id && (
                      <ul className="status-options-list">
                        <li onClick={() => handleStatusChange(job.id, 'Round 1')}>Round 1</li>
                        <li onClick={() => handleStatusChange(job.id, 'Round 2')}>Round 2</li>
                        <li onClick={() => handleStatusChange(job.id, 'Round 3')}>Round 3</li>
                      </ul>
                    )}
                  </div>
                </td>
                <td>
                  <button
                    onClick={() => handleStatusToggle(job.id)}
                    className={job.closed ? 'reject-btn' : 'select-btn'}
                  >
                    {job.closed ? 'Reject' : 'Select'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Application;