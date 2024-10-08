import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './OrgNav.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faTwitter, faLinkedin, faInstagram } from '@fortawesome/free-brands-svg-icons';
import { faChartBar, faBars, faGears, faSquarePlus, faUser, faListCheck } from '@fortawesome/free-solid-svg-icons';

const OrgNav = () => {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const handleConfirmLogout = () => {
    setShowLogoutModal(false);
    localStorage.clear();
    navigate("/");
    console.log("User logged out");
  };

  const handleCancelLogout = () => {
    setShowLogoutModal(false);
  };

  return (
    <>
      <div className="co">
        <header id='head'>
          <div id='home' className="welcome-line">
            <p>Welcome to Our Job Portal, <span>Recruit...</span></p>
            <FontAwesomeIcon icon={faFacebook} />
            <FontAwesomeIcon icon={faTwitter} />
            <FontAwesomeIcon icon={faLinkedin} />
            <FontAwesomeIcon icon={faInstagram} />
          </div>
          <nav className='org-nav'>
            <img id='icon' src="pro-logo.png" alt="logo" />
            <h1>Recruit</h1>
            <ul className='navbar-list1'>
              {/* <li className='nav-list-items1'>
                <NavLink to='/orghome' activeClassName="active">Home</NavLink>
              </li> */}
              {/* <li className='nav-list-items1'>
                <NavLink to='/orgjobs' activeClassName="active">Jobs</NavLink>
              </li> */}
              {/* <li className='nav-list-items1'>
                <NavLink to='/orghome' activeClassName="active">About</NavLink>
              </li> */}
              <li className='nav-list-items1' onClick={handleLogoutClick}>
                Logout
              </li>
            </ul>
          </nav>
              <hr />
        </header>
    
        
        <aside >
          <div className="org-nav-side">
            <ul className="org-nav-links">
              <li id='link'>
                <FontAwesomeIcon icon={faUser} />
                <NavLink to='/orgprofile' activeClassName="active">Profile</NavLink>
              </li>
              <li id='link'>
                <FontAwesomeIcon icon={faSquarePlus} />
                <NavLink to='/addjobs' activeClassName="active">Add Jobs</NavLink>
              </li>
              <li id='link'>
                <FontAwesomeIcon icon={faListCheck} />
                <NavLink to='/managejobs' activeClassName="active">Manage Jobs</NavLink>
              </li>
              <li id='link'>
                <FontAwesomeIcon icon={faBars} />
                <NavLink to='/application' activeClassName="active">Applications</NavLink>
              </li>
              <li id='link'>
                <FontAwesomeIcon icon={faGears} />
                <NavLink to='/orgsettings' activeClassName="active">Settings</NavLink>
              </li>
            </ul>
          </div>
        </aside>

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
    </>
  );
};

export default OrgNav;
