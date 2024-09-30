// import React, { useState } from 'react';

// const Manage = () => {
//   const [jobs, setJobs] = useState([
//     // Sample jobs data for testing purposes
//     {
//       id: 1,
//       jobTitle: 'Frontend Developer',
//       orgName: 'Tech Solutions',
//       deadline: '2024-09-30',
//       closed: false,
//     },
//     {
//       id: 2,
//       jobTitle: 'Backend Developer',
//       orgName: 'Innovative Labs',
//       deadline: '2024-10-15',
//       closed: true,
//     },
//   ]);

//   // Function to toggle open/closed status of a job
//   const handleStatusToggle = (id) => {
//     setJobs(
//       jobs.map((job) =>
//         job.id === id ? { ...job, closed: !job.closed } : job
//       )
//     );
//   };

//   return (
//     <div className="jobs-management">
//       <h2 id='hhh'>Job Management</h2>
//       <table className="jobs-table">
//         <thead>
//           <tr>
//             <th>Job Title</th>
//             <th>Org Name</th>
//             <th>Deadline</th>
//             <th>Manage</th>
//           </tr>
//         </thead>
//         <tbody>
//           {jobs.map((job) => (
//             <tr key={job.id}>
//               <td>{job.jobTitle}</td>
//               <td>{job.orgName}</td>
//               <td>{job.deadline}</td>
//               <td>
//                 <button
//                   onClick={() => handleStatusToggle(job.id)}
//                   className={job.closed ? 'closed' : 'open'}
//                 >
//                   {job.closed ? 'Reopen' : 'Close'}
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default Manage;
import axios from 'axios';
import React, { useEffect, useState } from 'react';

const Manage = () => {
  const [jobs, setJobs] = useState(['']);

  useEffect(() => {
    const getJobDetails = async () => {
      try {
        const res = await axios.get("http://localhost:8081/adminauth/JobDetails");
        setJobs(res.data.JobDetails);
      } catch (err) {
        console.log(err);
      }
    };

    getJobDetails();
  }, []); // Add the empty dependency array here

  // Function to toggle open/closed status of a job
  const handleStatusToggle = (id) => {
    setJobs(
      jobs.map((job) =>
        job._id === id ? { ...job, closed: !job.closed } : job // Change job.id to job._id
      )
    );
  };

  return (
    <div className="jobs-management">
      <h2 id='hhh'>Job Management</h2>
      <table className="jobs-table">
        <thead>
          <tr>
            <th>Job Title</th>
            <th>Org Name</th>
            <th>Deadline</th>
            <th>Manage</th>
          </tr>
        </thead>
        <tbody>
          {jobs.length > 0 ? ( // Check if jobs array has items
            jobs.map((job) => (
              <tr key={job._id}> {/* Ensure _id is used as the key */}
                <td>{job.position}</td>
                <td>{job.company?.orgname}</td> {/* Optional chaining to avoid errors */}
                <td>{new Date(job.jobDeadline).toLocaleDateString()}</td> {/* Format the date */}
                <td>
                  {/* <button
                    onClick={() => handleStatusToggle(job._id)} // Change job.id to job._id
                    className={job.closed ? 'closed' : 'open'}
                  >
                    {job.closed ? 'Reopen' : 'Close'}
                  </button> */}
                    <button id='view' className='view-bt' onClick={() => handleViewUser(user.id)}>View</button>
                  <button id='remove' onClick={() => handleRemoveUser(user.id)}>Remove</button>
                  
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No jobs available.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
    
  );
};

export default Manage;
