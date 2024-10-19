import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faTwitter, faLinkedin, faInstagram } from '@fortawesome/free-brands-svg-icons';

export const Sidebar = ({ activeSection, setActiveSection }) => {

 const AdminDetails = JSON.parse(localStorage.getItem("adm"))
  console.log(AdminDetails);

    const navigate = useNavigate();
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    const handleLogoutClick = () => {
        setShowLogoutModal(true);
    };

    const handleConfirmLogout = () => {
        localStorage.clear();
        navigate("/");
    };

    const handleCancelLogout = () => {
        setShowLogoutModal(false);
    };

    return (
        <>
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
            {/* Top Navbar */}
            <div  id="welcome-line">
                <p>Welcome to Our Job Portal, <span>Recruit...</span></p>
                <FontAwesomeIcon icon={faFacebook} />
                <FontAwesomeIcon icon={faTwitter} />
                <FontAwesomeIcon icon={faLinkedin} />
                <FontAwesomeIcon icon={faInstagram} />
            </div>

            <nav id="navbar1">
                <img id="pro-icon1" src="pro-logo.png" alt="logo" />
                <h1>Recruit</h1>
                {/* <ul className="navbar-list1">
                    <li className="nav-list-items1">
                        <Link to="/admindash">Dashboard</Link>
                    </li>
                    <li className="nav-list-items1" onClick={handleLogoutClick}>
                        <Link to="#">Logout</Link>
                    </li>
                </ul> */}
            </nav>
            
            {/* Sidebar and Main Content */}
            <div className="main-container">
                <div className="sidebar">
                    <center><i className="fa-solid fa-circle-user"></i></center>
                    <center><h3>{AdminDetails.adminname}</h3></center> <br />
                    <center><h3>{AdminDetails.adminEmail}</h3></center>

                    <ul>
                        <li className={activeSection === 'dashboard' ? 'active' : ''} onClick={() => setActiveSection('dashboard')}>
                            Dashboard
                        </li>
                        <li className={activeSection === 'Manageusers' ? 'active' : ''} onClick={() => setActiveSection('Manageusers')}>
                            Manage Users
                        </li>
                        <li className={activeSection === 'Manageorg' ? 'active' : ''} onClick={() => setActiveSection('Manageorg')}>
                            Manage Org
                        </li>
                        <li className={activeSection === 'Managejobs' ? 'active' : ''} onClick={() => setActiveSection('Managejobs')}>
                            Manage Jobs
                        </li>
                        <li className="logout-link">
                            <a href="#" onClick={handleLogoutClick}>
                                Logout
                            </a>
                        </li>
                    </ul>
                </div>

                {/* Main content (this can be filled with dynamic content based on the activeSection) */}
                <div className="main-content">
                    {/* Main content goes here, depending on the selected section */}
                    <h2>{activeSection}</h2>
                </div>
            </div>
        </>
    );
};