import React, { useEffect } from 'react'
import  { useState } from 'react';  // Correctly import useState
import axios from 'axios';


const ManageOrg = () => {
    const [users, setUsers] = useState(['']);
    useEffect(() => {
      const getOrgDetails= async () => {
        try {
            const res = await axios.get("http://localhost:8081/adminauth/orgDetails");
            setUsers(res.data.orgDetails);
        } catch (err) {
            console.log(err);
        }
    };
    getOrgDetails();
    },[])
      // Function to toggle ban/unban status
      const handleBan = (id) => {
        setUsers(
          users.map((user) =>
            user.id === id ? { ...user, banned: !user.banned } : user
          )
        );
      };
    
      return (
        <>
          <div className="users-management1">
            <h2 id='hhh'>Org Management</h2>
            <table className="users-tabl">
              <thead>
                <tr>
                  <th>Organisation name</th>
                  <th>Email</th>
                  <th>Phone Number</th>
                  <th>Manage</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.orgname}</td>
                    <td>{user.org_email}</td>
                    <td>{user.phno}</td>
                    <td>
                      <button
                        onClick={() => handleBan(user.id)}
                        className={user.banned ? 'banned' : 'ban'}
                      >
                        {user.banned ? 'Unban' : 'Ban'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )
    }

export default ManageOrg