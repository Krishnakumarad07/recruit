import React, { useState, useEffect } from "react";
import OrgNav from "../OrgNav";
import "./Application.css";
import axios from "axios";
import Swal from "sweetalert2";
const Application = () => {
  const [jobs, setJobs] = useState([]);
  const [hrDateTimeVisibleJobId, setHrDateTimeVisibleJobId] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
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
        const res = await axios.get(
          `http://localhost:8081/jobauth/Applicants?id=${orgid}`
        );
        console.log(res.data);
        setJobs(res.data);
      } catch (e) {
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

    if (newStatus === "HR") {
      setHrDateTimeVisibleJobId(jobId); // Set the currently selected job ID for HR
    } else {
      if (hrDateTimeVisibleJobId === jobId) {
        setHrDateTimeVisibleJobId(null); // Clear if the status changes from HR
      }
      setSelectedDate("");
      setSelectedTime("");
    }
  };

  const handleResumeClick = (resume) => {
    window.open(resume, "_blank");
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
    const loadingAlert = Swal.fire({
      title: "Removing Application...",
      html: "Please wait while we process your application.",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
    try {
      const res = await axios.delete(
        `http://localhost:8081/jobauth/RemoveApplicants/${selectedJobId}`
      );
      if (res.status === 200) {
        loadingAlert.close();

        Swal.fire({
          title: "Success!",
          text: "The Person application deleted Successfully.",
          icon: "success",
        });
      } else {
        loadingAlert.close();
        console.error("Error on Removing application:", error);
        Swal.fire({
          title: "Error!",
          text: "Failed to Remove your application. Please try again.",
          icon: "error",
        });
      }
      setJobs((prevJobs) =>
        prevJobs.filter((job) => job._id !== selectedJobId)
      );
    } catch (e) {
      console.log(e);
      loadingAlert.close();
      // console.error("Error on Removing application:", error);
      Swal.fire({
        title: "Error!",
        text: " An Internal Error Occured while Removing the application ",
        icon: "error",
      });
    }
    onCloseRemovePopup();
  };

  const handleSelect = async (job) => {
    const applicantData = {
      ...job,
      selectedDate,
      selectedTime,
    };
    const loadingAlert = Swal.fire({
      title: "Selecting Status...",
      html: "Please wait while we process your application.",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      console.log(applicantData);
      const res = await axios.post(
        "http://localhost:8081/jobauth/SelectApplicantStatus",
        applicantData
      );
      if (res.status === 200) {
        loadingAlert.close();
        Swal.fire({
          title: "Success!",
          text: "Applicant selected successfully!.",
          icon: "success",
        });
        window.location.reload();
        // alert("Applicant selected successfully!");
      } else {
        // alert("Failed to select applicant.");
        loadingAlert.close();
        Swal.fire({
          title: "Error!",
          text: "Failed to select applicant.",
          icon: "error",
        });
      }
    } catch (e) {
      console.log(e);
      // alert("An error occurred while selecting the applicant.");
      loadingAlert.close();
      Swal.fire({
        title: "Error!",
        text: "An error occurred while selecting the applicant.",
        icon: "error",
      });
    }
  };

  return (
    <>
      <OrgNav />
      <div className="job-management-container">
        <h2 className="have">Job Management</h2>
        <table className="job-table-box">
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
                  <button
                    onClick={() => handleResumeClick(job.resume)}
                    className="view-bt"
                  >
                    View Resume
                  </button>
                </td>
                <td>
                  <select
                    value={job.status}
                    onChange={(e) => {
                      const newValue = e.target.value;
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
                  {hrDateTimeVisibleJobId === job._id && ( // Check if this job's HR date/time should be visible
                    <div className="hr-date-time-inputs">
                      <label>Date:</label>
                      <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                      />
                      <label>Time:</label>
                      <input
                        type="time"
                        value={selectedTime}
                        onChange={(e) => setSelectedTime(e.target.value)}
                      />
                    </div>
                  )}
                </td>
                <td>
                  <button onClick={() => handleView(job)} className="view-bt">
                    View
                  </button>
                  <button
                    onClick={() => handleSelect(job)}
                    className="select-btn"
                  >
                    Select
                  </button>
                  <button
                    onClick={() => handleRemove(job)}
                    id="remove"
                    className="remove-btn"
                  >
                    Remove
                  </button>
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
          <button onClick={onRemove} className="remove-btn">
            Remove
          </button>
          <button onClick={onCloseRemovePopup} className="cancel-btn">
            Cancel
          </button>
        </div>
      )}
      {showViewPopup && (
        <div className="view-popup">
          <h2>View Applicant</h2>
          <p>
            <strong>Applicant Name:</strong> {selectedJob.name}
          </p>
          <p>
            <strong>Applicant Email:</strong> {selectedJob.email}
          </p>
          <p>
            <strong>Applicant Position:</strong> {selectedJob.position}
          </p>
          <p>
            <strong>Applicant Phone:</strong> {selectedJob.phone}
          </p>
          <p>
            <strong>Applicant Address:</strong> {selectedJob.address},{" "}
            {selectedJob.state}, {selectedJob.country}
          </p>
          <p>
            <strong>Education Qualification:</strong>{" "}
            {selectedJob.educationqualification}
          </p>
          <p>
            <strong>Percentage:</strong> {selectedJob.percentage.$numberDecimal}
            %
          </p>
          <p>
            <strong>Applied Date:</strong>{" "}
            {new Date(selectedJob.appliedDate).toLocaleDateString()}
          </p>

          {selectedJob.status === "HR" && (
            <>
              <p>
                <strong>Meeting Link:</strong> {selectedJob.hrRoundLink}
              </p>
              <p>
                <strong>Date and Time:</strong>{" "}
                {new Date(selectedJob.hrRoundDateAndTime).toLocaleString()}
              </p>
            </>
          )}

          <p>
            <strong>Applicant Resume:</strong>{" "}
            <a
              href={selectedJob.resume}
              target="_blank"
              rel="noopener noreferrer"
            >
              View Resume
            </a>
          </p>
          <button onClick={onCloseViewPopup} className="close-btn">
            Close
          </button>
        </div>
      )}
    </>
  );
};

export default Application;
