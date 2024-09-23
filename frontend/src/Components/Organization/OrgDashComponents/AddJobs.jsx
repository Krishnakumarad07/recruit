import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AddJobs.css'; // Import the external CSS file
import OrgNav from '../OrgNav'; // Reuse the OrgNav

const AddJobs = ({ addJob }) => {
  const navigate = useNavigate();
  const [jobData, setJobData] = useState({
    position: 'software engineer',
    company: 'zoho',
    location: 'maduarai',
    jobStatus: 'open',
    jobType: 'full-time',
    vacancy: '1',
    salary: 'advance computer science',
    requiredSkills: 'all',
    jobDescription: 'kldsjhf',
    jobDeadline: '12/09/2004',
    contactMail: 'abcd@gmail.com',
    jobFacilities: 'kjesfhl',
  });

  const handleChange = (e) => {
    setJobData({
      ...jobData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Job Created:', jobData);
    addJob({ ...jobData, id: Date.now() }); // Add job to the list
    navigate('/managejobs'); // Navigate to ManageJobs
  };

  return (
    <>
      <OrgNav />
      <div className="container">
        <form onSubmit={handleSubmit} className="form">
          <h2>Create Job</h2>
          <div className="form-grid">
            <div className="field-container">
              <label>Position</label>
              <input
                type="text"
                name="position"
                value={jobData.position}
                onChange={handleChange}
                required
              />
            </div>
            <div className="field-container">
              <label>Company</label>
              <input
                type="text"
                name="company"
                value={jobData.company}
                onChange={handleChange}
                required
              />
            
            </div>
            <div className="field-container">
              <label>Location</label>
              <input
                type="text"
                name="location"
                value={jobData.location}
                onChange={handleChange}
                required
              />
            </div>
            <div className="field-container">
              <label>Job Status</label>
              <select
                name="jobStatus"
                value={jobData.jobStatus}
                onChange={handleChange}
                required
              >
                <option value="">Select Job Status</option>
                <option value="Open">Open</option>
                <option value="Closed">Closed</option>
              </select>
            </div>
            <div className="field-container">
              <label>Job Type</label>
              <select
                name="jobType"
                value={jobData.jobType}
                onChange={handleChange}
                required
              >
                <option value="">Select Job Type</option>
                <option value="Full-Time">Full-Time</option>
                <option value="Part-Time">Part-Time</option>
              </select>
            </div>
            <div className="field-container">
              <label>Vacancy</label>
              <input
                type="number"
                name="vacancy"
                value={jobData.vacancy}
                onChange={handleChange}
                required
              />
            </div>
            <div className="field-container">
              <label>Salary</label>
              <input
                type="text"
                name="salary"
                value={jobData.salary}
                onChange={handleChange}
              />
            </div>
            <div className="field-container">
              <label>Required Skills</label>
              <input
                type="text"
                name="requiredSkills"
                value={jobData.requiredSkills}
                onChange={handleChange}
                required
              />
            </div>
            <div className="field-container">
              <label>Job Deadline</label>
              <input
                type="date"
                name="jobDeadline"
                value={jobData.jobDeadline}
                onChange={handleChange}
                required
              />
            </div>
            <div className="field-container">
              <label>Contact Mail</label>
              <input
                type="email"
                name="contactMail"
                value={jobData.contactMail}
                onChange={handleChange}
                required
              />
            </div>
            <div className="field-container">
              <label>Job Facilities</label>
              <input
                type="text"
                name="jobFacilities"
                value={jobData.jobFacilities}
                onChange={handleChange}
              />
            </div>
            <div className="field-container textarea">
              <label>Job Description</label>
              <textarea
                name="jobDescription"
                value={jobData.jobDescription}
                onChange={handleChange}
                required
              />
            </div>
            <button type="submit" className="submit-btn">Submit</button>
          </div>
        </form>
      </div>
    </>


  );
};

export default AddJobs;
