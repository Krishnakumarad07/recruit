import React, { useState } from 'react';
import OrgNav from '../OrgNav';
import './Application.css';

const Application = () => {
  const [jobs, setJobs] = useState([
    { id: 1, userName: 'John Doe', email: 'john@example.com', phone: '123-456-7890', resume: 'resume.pdf', status: '', closed: false },
    { id: 2, userName: 'Jane Doe', email: 'jane@example.com', phone: '987-654-3210', resume: 'resume.pdf', status: '', closed: true },
    { id: 3, userName: 'Bob Smith', email: 'bob@example.com', phone: '555-123-4567', resume: 'resume.pdf', status: '', closed: false },
    { id: 1, userName: 'John Doe', email: 'john@example.com', phone: '123-456-7890', resume: 'resume.pdf', status: '', closed: false },
    { id: 2, userName: 'Jane Doe', email: 'jane@example.com', phone: '987-654-3210', resume: 'resume.pdf', status: '', closed: true },
    { id: 3, userName: 'Bob Smith', email: 'bob@example.com', phone: '555-123-4567', resume: 'resume.pdf', status: '', closed: false },
      
  ]);

  const handleStatusChange = (jobId, newStatus) => {
    setJobs((prevJobs) =>
      prevJobs.map((job) => {
        if (job.id === jobId) {
          return { ...job, status: newStatus };
        }
        return job;
      })
    );
  };

  const handleResumeClick = (resume) => {
    console.log(`Resume clicked: ${resume}`);
  };

  const handleRemove = (jobId) => {
    setJobs((prevJobs) => prevJobs.filter((job) => job.id !== jobId));
  };

  const handleView = (jobId) => {
    console.log(`View clicked: ${jobId}`);
  };

  return (
    <>
      <OrgNav />
      <div className="job-management-container">
        <h2 className='have'>Job Management</h2>
        <table className="job-table-box" >
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
                  <select
                    value={job.status}
                    onChange={(e) => handleStatusChange(job.id, e.target.value)}
                  >
                    <option value="">Select Status</option>
                    <option value="Round 1">Round 1</option>
                    <option value="Round 2">Round 2</option>
                    <option value="Round 3">Round 3</option>
                  </select>
                </td>
                <td>
                  <button onClick={() => handleView(job.id)} className="view-btn">View</button>
                  
                  <button onClick={() => handleStatusChange(job.id, 'Selected')} className="select-btn">Select</button>
                  <button onClick={() => handleRemove(job.id)} id='remove'className="remove-btn">Remove</button>
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