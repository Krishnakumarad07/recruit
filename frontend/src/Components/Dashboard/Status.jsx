import React, { useState, useEffect } from 'react';
import Navside from './Navside';
import './Status.css';

const Status = () => {
  const [jobs, setJobs] = useState([
    {
      id: 1,
      title: 'Software Engineer',
      company: 'ABC Corporation',
      appliedDate: '2022-01-01',
      deadline: '2022-01-31',
      status: 'Waiting'
    },
    {
      id: 2,
      title: 'Data Scientist',
      company: 'XYZ Inc.',
      appliedDate: '2022-02-01',
      deadline: '2022-02-28',
      status: 'Waiting'
    },
    {
      id: 3,
      title: 'Product Manager',
      company: ' DEF Ltd.',
      appliedDate: '2022-03-01',
      deadline: '2022-03-31',
      status: 'Waiting'
    }
  ]);

  // useEffect(() => {
  //   axios.get('/api/jobs')
  //     .then(response => {
  //       console.log('Data fetched:', response.data);
  //       setJobs(response.data);
  //     })
  //     .catch(error => {
  //       console.error('Error fetching data:', error);
  //     });
  // }, []);

  return (
    <>
      <Navside />
      <div className="users-management">
        <h2 id='mm'>Job Status</h2>
        <table className="st-table animate__animated animate__slideInUp">
          <thead>
            <tr>
              <th>Job Title</th>
              <th>Company</th>
              <th>Applied Date</th>
              <th>DeadLine</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job) => (
              <tr key={job.id} className="animate__animated animate__fadeIn">
                <td>{job.title}</td>
                <td>{job.company}</td>
                <td>{job.appliedDate}</td>
                <td>{job.deadline}</td>
                <td>
                  <div className="status-animation">
                    <div className="waiting">
                      <span>{job.status}</span>
                      
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Status;