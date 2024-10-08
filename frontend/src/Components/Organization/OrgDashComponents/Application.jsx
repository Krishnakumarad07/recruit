import React, { useEffect, useState } from 'react';
import OrgNav from '../OrgNav';
import './Application.css';
import axios from 'axios';
const Application = () => {
  const [jobs, setJobs] = useState([
    // { id: 1, userName: 'John Doe', email: 'john@example.com', phone: '123-456-7890', resume: 'resume.pdf', status: '', closed: false },
    // { id: 2, userName: 'Jane Doe', email: 'jane@example.com', phone: '987-654-3210', resume: 'resume.pdf', status: '', closed: true },
    // { id: 3, userName: 'Bob Smith', email: 'bob@example.com', phone: '555-123-4567', resume: 'resume.pdf', status: '', closed: false },
    // { id: 1, userName: 'John Doe', email: 'john@example.com', phone: '123-456-7890', resume: 'resume.pdf', status: '', closed: false },
    // { id: 2, userName: 'Jane Doe', email: 'jane@example.com', phone: '987-654-3210', resume: 'resume.pdf', status: '', closed: true },
    // { id: 3, userName: 'Bob Smith', email: 'bob@example.com', phone: '555-123-4567', resume: 'resume.pdf', status: '', closed: false },
      
  ]);
useEffect(() => {
  const fetchApplicants=async() => {
    var org=localStorage.getItem("org");
    org=JSON.parse(org);
    const orgid=org._id;
    try {
      const res=await axios.get(`http://localhost:8081/jobauth/Applicants?id=${orgid}`)
      console.log(res.data);
      setJobs(res.data);
    }
    catch (e) {
      console.log(e);
    }
  };
  fetchApplicants();
},[]);
  const handleStatusChange = (jobId, newStatus) => {
    setJobs((prevJobs) =>
      prevJobs.map((job) => {
        if (job._id === jobId) {
          return { ...job, status: newStatus };
        }
        return job;
      })
    );
  };

  const handleResumeClick = (resume) => {
    window.open(resume, '_blank');
    console.log(`Resume clicked: ${resume}`);
  };

  const handleRemove = async(jobId) => {
    try {
      // Make a DELETE request to remove the job from the database
    
      const res=await axios.delete(`http://localhost:8081/jobauth/RemoveApplicants/${jobId}`);
      if(res.status === 200) {
        alert("The person is deleted")
      }
      else {
        alert("Internal Server error")
      }
      setJobs((prevJobs) => prevJobs.filter((job) => job._id !== jobId));
    } catch (e) {
      console.log(e);
    }
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
              <th>Position for Applied</th>
              <th>Resume</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job) => (
              <tr key={job._id}>
                <td>{job.name}</td>
                <td>{job.email}</td>
                <td>{job.position}</td>
                <td>
                  <button onClick={() => handleResumeClick(job.resume)} className="view-resume-btn">View Resume</button>
                </td>
                <td>
                  <select
                    value={job.status}
                    onChange={(e) => handleStatusChange(job._id, e.target.value)}
                  >
                    <option value="waiting">Select Status</option>
                    <option value="round-1">Round 1</option>
                    <option value="round-2">Round 2</option>
                    <option value="HR">HR</option>
                    <option value="Technical">Technical</option>
                    <option value="Selected">Select</option>
                    <option value="Rejected">Reject</option>


                  </select>
                </td>
                <td>
                  <button onClick={() => handleView(job._id)} className="view-btn">View</button>
                  
                  <button onClick={() => handleStatusChange(job._id, 'Selected')} className="select-btn">Select</button>
                  <button onClick={() => handleRemove(job._id)} id='remove'className="remove-btn">Remove</button>
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