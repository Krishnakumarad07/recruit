import React from 'react';
import './ManageJobs.css'; 
import OrgNav from "../OrgNav.jsx";
import axios from 'axios';
import { useEffect } from 'react';
import { useState } from 'react';
var org=localStorage.getItem("org");
org=JSON.parse(org);
console.log(org);

const ManageJobs = ({ jobs }) => {
 const [job, setJob] = useState('');
 const name = org.orgname;
useEffect(() => {
  const fetchAddedJob=async()=>{
    const id=org._id;
    try{
    const response=await axios.post('http://localhost:8081/orgauth/managejob',{id})
   setJob(response.data.jobs)
    console.log(response.data);
    }
  
  catch(error){
    console.log(error);
  }
}
fetchAddedJob();
},[])
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
                    <td>{job.jobDeadline}</td>
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
