import React, { useEffect } from 'react';
import './Home.css';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faTwitter, faLinkedin, faInstagram } from '@fortawesome/free-brands-svg-icons';
import axios from 'axios';
function Home() {

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('scroll-visible');
                }
            });
        });

        const elements = document.querySelectorAll('.scroll-animation');
        elements.forEach((el) => observer.observe(el));

        return () => {
            elements.forEach((el) => observer.unobserve(el));
        };
    }, []);
    useEffect(() => {
        const check = async () => {
            try {
                const res = await axios.put("http://localhost:8081/orgauth/isOpOrg");
                console.log(res);
            } catch (err) {
                console.log(err);
            }
        };

        check(); // Call the async function
    }, []); // Empty array to ensure it runs once when component mounts

    return (
        <>
            <div className="container-home">
                <header className="home-page">
                    <div id='home' className="welcome-line scroll-animation">
                        <p>Welcome Our Job Portal, <span>Recruit...</span></p>

                        <FontAwesomeIcon icon={faFacebook} />
                        <FontAwesomeIcon icon={faTwitter} />
                        <FontAwesomeIcon icon={faLinkedin} />
                        <FontAwesomeIcon icon={faInstagram} />

                    </div>

                    <nav className='navbar scroll-animation'>
                        <img id='pro-icon' src="pro-logo.png" alt="logo" />
                        <h1>Recruit</h1>

                        <ul className='navbar-list'>
                            <Link to='/'><li className='nav-list-items'>Home</li></Link>
                            <a href="#"> <Link to='/loginpage' > <li className='nav-list-items'>Jobs</li></Link></a>
                            <Link to='/loginpage'><li className='nav-list-items'>Dashboard</li></Link>
                            <a href="#footer">  <li className='nav-list-items'>About</li></a>
                            <Link to='/loginpage' > <li className='nav-list-items'>Login</li></Link>
                            <Link to='/orglogin' ><li className='nav-list-items'>Post Jobs</li></Link>
                        </ul>
                    </nav>

                    <div className="home-banner scroll-animation">
                        <div className="box">
                            <h1>To Get A Dream Job <span>Today.</span></h1>
                            <p>1000+ peoples are visit this portal daily..</p>
                            <Link to='/sign'><button>Apply Now</button></Link>
                        </div>

                        <img id='backdrop' src="backdrop.png" alt="backdrop" />
                    </div>
                </header>

                <main className='main-cont'>
                    <h3 id='com-name' className="scroll-animation">Our Trusted Company</h3>
                    <div className="company-logo scroll-animation">
                        <img src="logo1 (4).png" alt="company1" />
                        <img src="logo1 (2).png" alt="company2" />
                        <img src="logo1 (3).png" alt="company3" />
                        <img src="logo1 (1).png" alt="company4" />
                        <img src="logo1 (6).png" alt="company5" />
                        <img src="logo1 (5).png" alt="company5" />
                    </div>

                    <div className="sec-list">
                        <div className="vacancies-section scroll-animation">
                            <h1 id='heading'>Most Popular Vacancies</h1>
                            <div className="vacancies-list">

                                <div>
                                    <p>Anesthesiologists</p>
                                    <p id='one'>45,904 Open Positions</p>
                                </div>
                                <div>
                                    <p>Software Developer</p>
                                    <p id='one'>50,364 Open Positions</p>
                                </div>
                                <div>
                                    <p>IT Manager</p>
                                    <p id='one'>50,364 Open Positions</p>
                                </div>
                                <div>
                                    <p>Surgeons</p>
                                    <p id='one'>50,364 Open Positions</p>
                                </div>
                                <div>
                                    <p>Data Scientist</p>
                                    <p id='one'>50,364 Open Positions</p>
                                </div>
                                <div>
                                    <p>Research Analysis</p>
                                    <p id='one'>50,364 Open Positions</p>
                                </div>
                                <div>
                                    <p>Gynecologists</p>
                                    <p id='one'>50,364 Open Positions</p>
                                </div>
                                <div>
                                    <p>Financial Manager</p>
                                    <p id='one'>50,364 Open Positions</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="job-portal-box scroll-animation">
                        <div className="job-portal-banner">
                            <h2>How Job Portal Works</h2>
                            <p>To Choose Your Trending Job Dream & To Make Future Bright.</p>

                            <div className="job-portal-stats">
                                <div className="stat-item">
                                    <h3>Account Create</h3>
                                    <p>To create your account be confident & safely</p>
                                </div>
                                <div className="stat-item">
                                    <h3>Upload Resume</h3>
                                    <p>To create your account be confident & safely</p>
                                </div>
                                <div className="stat-item">
                                    <h3>Find Jobs</h3>
                                    <p>To create your account be confident & safely</p>
                                </div>
                                <div className="stat-item">
                                    <h3>Apply Jobs</h3>
                                    <p>To create your account be confident & safely</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>

                <footer id='footer' className="footer scroll-animation">
                    <div className="footer-info">
                        <div className="about">
                            <a href='#home'>
                                <h3>About Company</h3>
                                <p>Contact Us</p>
                                <p>Terms & Condition</p>
                                <p>Privacy & Policy</p>
                                <p>Candidate Listing</p>
                            </a>
                        </div>
                        <div className="can-support">
                            <a href='#home'>
                                <h3>For Candidates</h3>
                                <p>Upload Resume</p>
                                <p>Save JobList</p>
                                <p>Candidate Dashboard</p>
                                <p>Browse Jobs</p>
                            </a>
                        </div>
                        <div id='ab-img'>
                            <img src="about1.png" alt="" />
                        </div>
                        <div className="emp">
                            <a href="#home">
                                <h3>For Employers</h3>
                                <p>Post A Job</p>
                                <p>Job Package</p>
                                <p><a href='/adlogin'>ADMIN</a></p>

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
            </div>
        </>
    );
}

export default Home;
