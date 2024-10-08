import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './Navside.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faTwitter, faLinkedin, faInstagram } from '@fortawesome/free-brands-svg-icons';
import { faChartBar, faBars, faGears, faSquarePlus, faUser, faListCheck } from '@fortawesome/free-solid-svg-icons';

const Navside = () => {
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
                <NavLink to='/' activeClassName="active">Home</NavLink>
              </li> */}
              {/* <li className='nav-list-items1'>
                <NavLink to='/jobs' activeClassName="active">Jobs</NavLink>
              </li> */}
              {/* <li className='nav-list-items1'>
                <NavLink to='/loginpage' activeClassName="active">About</NavLink>
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
                <NavLink to='/profile' activeClassName="active">Profile</NavLink>
              </li>
              {/* <li id='link'>
              <FontAwesomeIcon icon={faChartBar} />
                <NavLink to='/status' activeClassName="active">Status</NavLink>
              </li> */}
              <li id='link'>
              <FontAwesomeIcon icon={faBars} />
                <NavLink to='/applyjob' activeClassName="active">Applied Jobs</NavLink>
              </li>
              <li id='link'>
              <FontAwesomeIcon icon={faBars} />
                <NavLink to='/jobs' activeClassName="active">Jobs</NavLink>
              </li>
              {/* <li id='link'>
                <FontAwesomeIcon icon={faBars} />
                <NavLink to='/applications' activeClassName="active">Applications</NavLink>
              </li> */}
              <li id='link'>
                <FontAwesomeIcon icon={faGears} />
                <NavLink to='/setting' activeClassName="active">Settings</NavLink>
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

export default Navside;
