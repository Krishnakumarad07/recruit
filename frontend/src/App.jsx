import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Components/Home/Home.jsx';
import Login from './Components/Loginpage/Login.jsx';
import CreateAccount from './Components/Loginpage/CreateAccount.jsx';
import Error from './Error.jsx';
import Profile from './Components/Dashboard/Profile.jsx';
import Navside from './Components/Dashboard/Navside.jsx';
// import Dashboard from './Components/Dashboard/Dashboard.jsx';
import JobList from './Components/Jobs/JobList.jsx';
import OrgLogin from './Components/Organization/OrgLogin.jsx';
import Signup from './Components/Organization/Signup.jsx';
import Setting from './Components/Dashboard/Setting.jsx';
import ApplyJob from './Components/Dashboard/ApplyJob.jsx';
import Status from './Components/Dashboard/Status.jsx';
import OrgNav from './Components/Organization/OrgNav.jsx';
// import OrgDash from './Components/Organization/OrgDash.jsx';
import OrgHome from './Components/Organization/Org-home/OrgHome.jsx';
import OrgProfile from './Components/Organization/OrgDashComponents/OrgProfile.jsx';
import AddJobs from './Components/Organization/OrgDashComponents/AddJobs.jsx';
import ManageJobs from './Components/Organization/OrgDashComponents/ManageJobs.jsx';
import OrgJobs from './Components/Organization/OrgDashComponents/OrgJobs.jsx';
import Orgsettings from './Components/Organization/OrgDashComponents/Orgsettings.jsx';
import AdDash from './Components/Admin/AdDash.jsx';
import AdminDash from './Components/Admin/AdminDash.jsx';
import ManageUser from './Components/Admin/ManageUser.jsx';
import Manage from './Components/Admin/Manage.jsx';
import { Sidebar } from './Components/Admin/Sidebar.jsx';
import ManageOrg from './Components/Admin/ManageOrg.jsx';
import Adlogin from './Components/Admin/Adlogin.jsx';
import Application from './Components/Organization/OrgDashComponents/Application.jsx';


function App() {
  const [jobs, setJobs] = useState([]);
  const addJob = (newJob) => {
    setJobs((prevJobs) => [...prevJobs, newJob]);
  };

  return (
    <Router>
      <div>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/loginpage' element={<Login />} />
          <Route path='/sign' element={<CreateAccount />} />
          <Route path='*' element={<Error />} />
          {/* <Route path='/dashboard' element={<Dashboard />} /> */}
          <Route path='/nav' element={<Navside />} />
          <Route path='/profile' element={<Profile />} />
          <Route path='/jobs' element={<JobList jobs={jobs} />} />
          <Route path='/orglogin' element={<OrgLogin />} />
          <Route path='/orgsignup' element={<Signup />} />
          <Route path='/status' element={<Status />} />
          <Route path='/setting' element={<Setting />} />
          <Route path='/applyjob' element={<ApplyJob />} />
          <Route path='/orgnav' element={<OrgNav />} />
          {/* <Route path='/orgdash' element={<OrgDash />} /> */}
          <Route path='/orghome' element={<OrgHome />} />
          <Route path='/orgprofile' element={<OrgProfile />} />
          <Route path='/addjobs' element={<AddJobs addJob={addJob} />} />
          <Route path='/managejobs' element={<ManageJobs jobs={jobs} />} />
          <Route path='/orgjobs' element={<OrgJobs jobs={jobs} />} />
          <Route path='/orgsettings' element={<Orgsettings />} />
          <Route path='/addash' element={<AdDash />} />
          <Route path='/admindash' element={<AdminDash/>} />
          <Route path='/manageuser' element={<ManageUser/>} />
          <Route path='/manage' element={<Manage/>} />
          <Route path='/side' element={<Sidebar/>}/>
          <Route path='/manageorg' element={<ManageOrg/>}/>
          <Route path='/adlogin' element={<Adlogin/>}/>
          <Route path='/application' element={<Application/>}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
