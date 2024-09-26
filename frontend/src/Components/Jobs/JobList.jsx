import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faTwitter, faLinkedin, faInstagram } from '@fortawesome/free-brands-svg-icons';
import { Link, useNavigate } from 'react-router-dom';
import './JobList.css';
import axios from 'axios';

const JobList = ({ jobs }) => {
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [showApplyModal, setShowApplyModal] = useState(false);
    const [selectedJob, setSelectedJob] = useState({});
    const navigate = useNavigate();
    const [job, setJob] = useState([]);

    const handleLogoutClick = () => {
        setShowLogoutModal(true);
    };

    const handleConfirmLogout = () => {
        navigate("/");
        setShowLogoutModal(false);
    };

    const handleCancelLogout = () => {
        setShowLogoutModal(false);
    };

    useEffect(() => {
        const joblist = async () => {
            try {
                const response = await axios.get('http://localhost:8081/orgauth/joblist')
                console.log('Response data:', response.data);
                setJob(response.data.joblist)
            } catch (error) {
                console.log('error fetching jobslist', error)
            }
        }
        joblist();
    }, [])

    useEffect(() => {
        const check = async () => {
            try {
                const res = await axios.put("http://localhost:8081/orgauth/isOpOrg");
                console.log(res.data);
            } catch (err) {
                console.log(err);
            }
        };

        check(); // Call the async function
    }, []);

    const handleApplyClick = (job) => {
        setShowApplyModal(true);
        setSelectedJob(job);
    };

    const handleApplyModalClose = () => {
        setShowApplyModal(false);
    };

    const handleApplyFormSubmit = (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            resume: formData.get('resume'),
            coverLetter: formData.get('coverLetter'),
            jobId: selectedJob.id
        };
        // Axios code to submit the application
        // axios.post('http://localhost:8081/orgauth/applyJob', data)
        //   .then(response => {
        //     console.log(response.data);
        //     handleApplyModalClose();
        //   })
        //   .catch(error => {
        //     console.log(error);
        //   });
        console.log('Application submitted!');
        handleApplyModalClose();
    };

    return (
        <>
            <div className="main-content">
                <div id='home1' className="welcome-line">
                    <p>Welcome to Our Job Portal, <span>Recruit...</span></p>
                    <FontAwesomeIcon icon={faFacebook} />
                    <FontAwesomeIcon icon={faTwitter} />
                    <FontAwesomeIcon icon={faLinkedin} />
                    <FontAwesomeIcon icon={faInstagram} />
                </div>

                <div className="navbarjobs">
                    <nav className='navbar5' id='ten'>
                        <img id='pro-icon1' src="pro-logo.png" alt="logo" />
                        <h1>Recruit</h1>
                        <ul className='navbar-list1'>
                            {/* <li className='nav-list-items1'>
                <Link to='/'>Home</Link>
              </li> */}
                            <li className='nav-list-items1'>
                                <Link to='/profile'>Dashboard</Link>
                            </li>
                            {/* <a href="#footer-job">
                                <li className='nav-list-items1'>About</li>
                            </a> */}
                            <li className='nav-list-items1' onClick={handleLogoutClick}>
                                <Link to='#'>Logout</Link>
                            </li>
                        </ul>
                    </nav>

                    {showLogoutModal && (
                        <div className="modal">
                            <div className="modal-content">
                                <h3>Confirm Logout</h3>
                                <p>Are you sure you want to logout?</p>
                                <button id='yes' onClick={handleConfirmLogout}>Yes</button>
                                <button onClick={handleCancelLogout}>No</button>
                            </div>
                        </div>
                    )}
                </div>

                <h2 id='h3'>Job Listings</h2>

                <div className="job-list-container">
                    {job.length > 0 ? (
                        job.map((job) => (
                            <div className="job-item" key={`${job.position}-${job.company.orgname}`}>
                                <h3>{job.position}</h3>
                                <p><strong> Company:</strong> {job.company.orgname}</p>
                                <p><strong>Location:</strong> {job.location}</p>
                                <p><strong>Job Type:</strong> {job.jobType}</p>
                                <p><strong>Job Description:</strong> {job.jobDescription}</p>
                                <button className="btn" onClick={() => handleApplyClick(job)}>Apply now</button>
                            </div>
                        ))
                    ) : (
                        <p>No jobs available.</p>
                    )}
                </div>

                {showApplyModal && (
                    <div className={`hero ${selectedJob.position.toLowerCase().replace(/\s+/g, '-')}`}>
                        <div className="hero-content">
                            <h3>Apply for {selectedJob.position}</h3>
                            <p><strong>Company:</strong> {selectedJob.company.orgname}</p>
                            <p><strong>Location:</strong> {selectedJob.location}</p>
                            <p><strong>Job Type:</strong> {selectedJob.jobType}</p>
                            <p><strong>Job Description:</strong> {selectedJob.jobDescription}</p>
                            <form onSubmit={handleApplyFormSubmit}>
                                <label className="label">Name:</label>
                                <input type="text" name="name" required />
                                <label className="label">Email:</label>
                                <input type="email" name="email" required />
                                <label className="label">Resume:</label>
                                <input type="file" name="resume" required />
                                {/* <label className="label">Cover Letter:</label>
                                <textarea name="coverLetter" required /> */}
                                <label className="label">Phone Number:</label>
                                <input type="tel" name="phoneNumber" required />
                                <label className="label">LinkedIn Profile </label>
                                <input type="url" name="linkedinProfile" />
                                <label className="label">GitHub Profile (optional):</label>
                                <input type="url" name="githubProfile" />
                                <button type="submit" className="submit-button">Apply</button>
                            </form>
                            <button className="close-button" onClick={handleApplyModalClose}>Close</button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default JobList;