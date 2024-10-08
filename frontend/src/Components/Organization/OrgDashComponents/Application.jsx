import React, { useState, useEffect } from 'react';
import OrgNav from '../OrgNav';
import './Application.css';
import axios from 'axios';

const Application = () => {
  const [jobs, setJobs] = useState([]);
  const [hrDateTimeVisible, setHrDateTimeVisible] = useState(false);
  const [showRemovePopup, setShowRemovePopup] = useState(false);
  const [showViewPopup, setShowViewPopup] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [selectedJob, setSelectedJob] = useState({});

  useEffect(() => {
    const fetchApplicants = async () => {
      var org = localStorage.getItem("org");
      org = JSON.parse(org);
      const orgid = org._id;
      try {
        const res = await axios.get(`http://localhost:8081/jobauth/Applicants?id=${orgid}`)
        console.log(res.data);
        setJobs(res.data);
      }
      catch (e) {
        console.log(e);
      }
    };
    fetchApplicants();
  }, []);

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

  const handleRemove = (job) => {
    setShowRemovePopup(true);
    setSelectedJobId(job._id);
    setSelectedJob(job);
  };

  const handleView = (job) => {
    setShowViewPopup(true);
    setSelectedJobId(job._id);
    setSelectedJob(job);
  };

  const onCloseRemovePopup = () => {
    setShowRemovePopup(false);
  };

  const onCloseViewPopup = () => {
    setShowViewPopup(false);
  };

  const onRemove = async () => {
    try {
      const res = await axios.delete(`http://localhost:8081/jobauth/RemoveApplicants/${selectedJobId}`);
      if (res.status === 200) {
        alert("The person is deleted");
      } else {
        alert("Internal Server error");
      }
      setJobs((prevJobs) => prevJobs.filter((job) => job._id !== selectedJobId));
    } catch (e) {
      console.log(e);
    }
    onCloseRemovePopup();
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
                  <button onClick={() => handleResumeClick(job.resume)} className="view-bt">View Resume</button>
                </td>
                <td>
                  <select
                    value={job.status}
                    onChange={(e) => {
                      const newValue = e.target.value;
                      setHrDateTimeVisible(newValue === 'HR');
                      handleStatusChange(job._id, newValue);
                    }}
                  >
                    <option value="waiting">Select Status</option>
                    <option value="round-1">Round 1</option>
                    <option value="round-2">Round 2</option>
                    <option value="HR">HR</option>
                    <option value="Technical">Technical</option>
                    <option value="Selected">Select</option>
                    <option value="Rejected">Reject</option>
                  </select>
                  {hrDateTimeVisible && (
                    <div className="hr-date-time-inputs">
                      <label>Date:</label>
                      <input type="date" />
                      <label>Time:</label>
                      <input type="time" />
                    </div>
                  )}
                </td>
                <td>
                  <button onClick={() => handleView(job)} className="view-bt">View</button>
                  <button  className="view-bt">Select</button>
                  <button onClick={() => handleRemove(job)} id='remove' className="remove-btn">Remove</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showRemovePopup && (
        <div className="remove-popup">
          <h2>Remove Applicant</h2>
          <p>Are you sure you want to remove this applicant?</p>
          {/* <p>Applicant Name: {selectedJob.name}</p>
          <p>Applicant Email: {selectedJob.email}</p> */}
          <button onClick={onRemove} className="remove-btn">Remove</button>
          <button onClick={onCloseRemovePopup} className="cancel-btn">Cancel</button>
        </div>
      )}
      {showViewPopup && (
        <div className="view-popup">
          <h2>View Applicant</h2>
          <p>Applicant Name: {selectedJob.name}</p>
          <p>Applicant Email: {selectedJob.email}</p>
          <p>Applicant Position: {selectedJob.position}</p>
          <p>Applicant Resume: <a href={selectedJob.resume} target="_blank">View Resume</a></p>
          <button onClick={onCloseViewPopup} className="close-btn">Close</button>
        </div>
      )}
    </>
  );
};

export default Application;