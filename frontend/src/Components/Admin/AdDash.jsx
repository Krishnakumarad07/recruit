import React, { useState,useEffect } from 'react';
import axios from 'axios';  // Correctly import useState

const AdDash = () => {
  
  const [count, setCount] = useState('');
  useEffect(() => {
    const getAllDetails= async () => {
      try {
          const res = await axios.get("http://localhost:8081/adminauth/allcount");
          setCount(res.data);
      } catch (err) {
          console.log(err);
      }
  };
  getAllDetails();
  },[])
  console.log(count);
 return(
<>

<div className="stats-grid">
          <div className="stat-box">
            <p>Users</p><span>{count.UserCount}</span>
            
          </div>
          <div className="stat-box">
            <p>Organizations</p><span>{count.OrgCount}</span>
            
          </div>
          <div className="stat-box">
            <p>Total Jobs </p><span>{count.JobCount}</span>
           
          </div>
        </div>
</>
  )
};

export default AdDash;
