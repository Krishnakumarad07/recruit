import React, { useState } from 'react';

const Manage = () => {
  const [jobs, setJobs] = useState([
    // Sample jobs data for testing purposes
    {
      id: 1,
      jobTitle: 'Frontend Developer',
      orgName: 'Tech Solutions',
      deadline: '2024-09-30',
      closed: false,
    },
    {
      id: 2,
      jobTitle: 'Backend Developer',
      orgName: 'Innovative Labs',
      deadline: '2024-10-15',
      closed: true,
    },
  ]);

  // Function to toggle open/closed status of a job
  const handleStatusToggle = (id) => {
    setJobs(
      jobs.map((job) =>
        job.id === id ? { ...job, closed: !job.closed } : job
      )
    );
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
          {jobs.map((job) => (
            <tr key={job.id}>
              <td>{job.jobTitle}</td>
              <td>{job.orgName}</td>
              <td>{job.deadline}</td>
              <td>
                <button
                  onClick={() => handleStatusToggle(job.id)}
                  className={job.closed ? 'closed' : 'open'}
                >
                  {job.closed ? 'Reopen' : 'Close'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Manage;
