import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faTwitter, faLinkedin, faInstagram } from '@fortawesome/free-brands-svg-icons';
import { Link, useNavigate } from 'react-router-dom';
import './OrgJobs.css';
const OrgJobs = ({ jobs }) => {
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const navigate = useNavigate();

    const handleLogoutClick = () => {
        setShowLogoutModal(true);
    };

    const handleConfirmLogout = () => {
        localStorage.clear();
        navigate("/");
        setShowLogoutModal(false);
    };

    const handleCancelLogout = () => {
        setShowLogoutModal(false);
    };
    const job = [
        { id: 1, position: "Software Developer", company: "Tech Co", location: "Remote", salary: "$80,000", jobDeadline: "Sep 30, 2024", contactMail: "contact@techco.com", jobDescription: "Developing web applications using React." },
        { id: 2, position: "UI/UX Designer", company: "Design Corp", location: "San Francisco", salary: "$70,000", jobDeadline: "Oct 5, 2024", contactMail: "careers@designcorp.com", jobDescription: "Designing user interfaces for mobile apps." }
    ];
    return (
        <>
            <div className="main-content">
                <div id='home' className="welcome-line">
                    <p>Welcome to Our Job Portal, <span>Recruit...</span></p>
                    <FontAwesomeIcon icon={faFacebook} />
                    <FontAwesomeIcon icon={faTwitter} />
                    <FontAwesomeIcon icon={faLinkedin} />
                    <FontAwesomeIcon icon={faInstagram} />
                </div>

                <div className="nav-jobs">
                    <nav className='navbar1'>
                        <img id='pro-icon1' src="pro-logo.png" alt="logo" />
                        <h1>Recruit</h1>
                        <ul className='navbar-list1'>
                            {/* <li className='nav-list-items1'>
                                <Link to='/orghome'>Home</Link>
                            </li> */}
                            <li className='nav-list-items1'>
                                <Link to='/orgprofile'>Dashboard</Link>
                            </li>
                            <a href="#footer-job">
                                <li className='nav-list-items1'>About</li>
                            </a>
                            <li className='nav-list-items1' onClick={handleLogoutClick}>
                                <Link to='#'>Logout</Link>
                            </li>
                        </ul>
                    </nav>
                    <hr />
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
                    
                    {jobs.length > 0 ? (
                        jobs.map((job) => (
                            <div className="job-item" key={job.id}>
                                <h3>{job.position}</h3>
                                <p><strong>Company:</strong> {job.company}</p>
                                <p><strong>Location:</strong> {job.location}</p>
                                <p><strong>Salary:</strong> {job.salary}</p>
                                <p><strong>Deadline:</strong> {job.jobDeadline}</p>
                                <p><strong>Contact:</strong> {job.contactMail}</p>
                                <p>{job.jobDescription}</p>
                                <button className="btn">Apply now</button>
                            </div>
                        ))
                    ) : (
                        <p>No jobs available.</p>
                    )}
                </div>
            </div>

            <footer id='footer' className="footer1">
                <div id='footer-job' className="footer-info">
                    <div className="about">
                        <a href='#home'><h3>About Company</h3>
                            <p>Contact Us</p>
                            <p>Terms & Condition</p>
                            <p>Privacy & Policy</p>
                            <p>Candidate Listing</p>
                        </a>
                    </div>
                    <div className="can-support">
                        <a href='#home'><h3>For Candidates</h3>
                            <p>Upload Resume</p>
                            <p>Save Job List</p>
                            <p>Candidate Dashboard</p>
                            <p>Browse Jobs</p>
                        </a>
                    </div>
                    <div id='ab-img'>
                        <img src="about1.png" alt="" />
                    </div>
                    <div className="emp">
                        <a href="#home"><h3>For Employers</h3>
                            <p>Post A Job</p>
                            <p>Job Package</p>
                            <p>Employee Dashboard</p>
                        </a>
                    </div>
                    <div className="support">
                        <h3>Support</h3>
                        <FontAwesomeIcon icon={faFacebook} />
                        <FontAwesomeIcon icon={faTwitter} />
                        <FontAwesomeIcon icon={faLinkedin} />
                        <FontAwesomeIcon icon={faInstagram} />
                    </div>
                </div>
                <p id='last-line'>&copy; {new Date().getFullYear()} __@Recruit. All rights reserved.</p>
            </footer>
        </>
    );
};
export default OrgJobs;
