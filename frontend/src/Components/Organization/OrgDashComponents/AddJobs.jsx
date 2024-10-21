import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AddJobs.css"; // Import the external CSS file
import OrgNav from "../OrgNav"; // Reuse the OrgNav
import axios from "axios";
import Swal from "sweetalert2";
// import { set } from 'mongoose';
var org = localStorage.getItem("org");
org = JSON.parse(org);
console.log(org);

const AddJobs = ({ addJob }) => {
  const navigate = useNavigate();
  // const [jobData, setJobData] = useState({
  //   position: 'software engineer',
  //   company: org.orgname,
  //   location: 'madurai',
  //   jobType: 'full-time',
  //   vacancy: '1',
  //   salary: '200000-350000',
  //   requiredSkills: 'all',
  //   jobDescription: 'kldsjhf',
  //   jobDeadline: '12/09/2004',
  //   contactMail: org.org_email,
  //   jobFacilities: 'kjesfhl',
  // });
  const [position, setPosition] = useState("");
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState("");
  const [vacancy, setVacancy] = useState("");
  const [salary, setSalary] = useState("");
  const [requiredSkills, setRequiredSkills] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [jobDeadline, setJobDeadline] = useState("");
  const [contactMail, setContactMail] = useState();
  const [jobFacilities, setJobFacilities] = useState("");
  // const handleChange = (e) => {
  //   setJobData({
  //     ...jobData,
  //     [e.target.name]: e.target.value
  //   });
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const loadingAlert = Swal.fire({
      title: "Submitting Ur Job...",
      html: "Please wait while we process your application.",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
    const newJob = {
      position,
      company,
      location,
      jobType,
      vacancy,
      salary,
      requiredSkills,
      jobDescription,
      jobDeadline,
      contactMail,
      jobFacilities,
    };
    try {
      const response = await axios.post(
        "http://localhost:8081/orgauth/addjobs",
        { newJob, _id: org._id }
      );
      setPosition("");
      setCompany("");
      setLocation("");
      setJobType("");
      setVacancy("");
      setSalary("");
      setRequiredSkills("");
      setJobDescription("");
      setJobDeadline("");
      setContactMail("");
      setJobFacilities("");
      // alert("Job is posted")
      loadingAlert.close();
      Swal.fire({
        title: "Success!",
        text: "Job Is Posted",
        icon: "success",
      });
    } catch (error) {
      console.log("Error creating job:", error);
      loadingAlert.close();
      Swal.fire({
        title: "Error!",
        text:
          error.response?.data?.message ||
          "Failed to create Job. Please try again.",
        icon: "error",
      });
    }
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
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                required
              />
            </div>
            <div className="field-container">
              <label>Company</label>
              <input
                type="text"
                name="company"
                value={org.orgname}
                disabled
                required
              />
            </div>
            <div className="field-container">
              <label>Location</label>
              <input
                type="text"
                name="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
              />
            </div>
            {/* <div className="field-container">
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
            </div> */}
            <div className="field-container">
              <label>Job Type</label>
              <select
                name="jobType"
                value={jobType}
                onChange={(e) => setJobType(e.target.value)}
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
                value={vacancy}
                onChange={(e) => setVacancy(e.target.value)}
                required
              />
            </div>
            <div className="field-container">
              <label>Salary</label>
              <input
                type="text"
                name="salary"
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
              />
            </div>
            <div className="field-container">
              <label>Required Skills</label>
              <input
                type="text"
                name="requiredSkills"
                value={requiredSkills}
                onChange={(e) => setRequiredSkills(e.target.value)}
                required
              />
            </div>
            <div className="field-container">
              <label>Job Deadline</label>
              <input
                type="date"
                name="jobDeadline"
                value={jobDeadline}
                onChange={(e) => setJobDeadline(e.target.value)}
                required
              />
            </div>
            <div className="field-container">
              <label>Contact Mail</label>
              <input
                type="email"
                name="contactMail"
                value={org.org_email}
                onChange={(e) => setContactMail(e.target.value)}
                required
              />
            </div>
            <div className="field-container">
              <label>Job Facilities</label>
              <input
                type="text"
                name="jobFacilities"
                value={jobFacilities}
                onChange={(e) => setJobFacilities(e.target.value)}
              />
            </div>
            <div className="field-container textarea">
              <label>Job Description</label>
              <textarea
                name="jobDescription"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="submit-btn">
              Submit
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddJobs;
