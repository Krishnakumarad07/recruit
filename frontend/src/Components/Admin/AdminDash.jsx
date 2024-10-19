import React from 'react'
import './Admin.css'
import AdDash from './AdDash';
import ManageUser from './ManageUser';
import Manage from './Manage';
import {useNavigate} from "react-router-dom"
import { useState } from 'react';
import { Sidebar } from './Sidebar';
import ManageOrg from './ManageOrg';
import { useLocalStorage } from 'react-use';

const AdminDash = () => {
  const navigate = useNavigate();
  
  const [activeSection, setActiveSection] = useLocalStorage('activeSection','dashboard');
  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return <AdDash />;
      case "Manageusers":
        return <ManageUser/>;
        case "Manageorg":
          return <ManageOrg/>;

      case "Managejobs":
        return <Manage/>;
      default:
        return <AdDash/>;
    }
  };
  return (
<>
      <div className="admin-dashboard">
        <div className="sidebar-content">
          <Sidebar
            activeSection={activeSection}
            setActiveSection={setActiveSection}
            onLogout={() => {
              navigate("/orglogin") ;
            }}
            history={navigate}
          />
        </div>
        <div className="main-content">{renderContent()}</div>
      </div>
    </>
  )
}

export default AdminDash