import React, { useEffect } from 'react'
import  { useState } from 'react';  
import axios from 'axios';// Correctly import useState

const ManageUser = () => {
  const [users, setUsers] = useState(['']);

  useEffect(() => {
    const getUserDetails= async () => {
      try {
          const res = await axios.get("http://localhost:8081/adminauth/UserDetails");
          setUsers(res.data.UserDetails);
      } catch (err) {
          console.log(err);
      }
  };
  getUserDetails();
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
        <h2 id='hhh'>Users Management</h2>
        <table className="users-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone Number</th>
              <th>Manage</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{user.phone}</td>
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

export default ManageUser