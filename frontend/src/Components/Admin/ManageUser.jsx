import React from 'react'
import  { useState } from 'react';  // Correctly import useState

const ManageUser = () => {
  const [users, setUsers] = useState([
    // Sample users data for testing purposes
    {
      id: 1,
      username: 'JohnDoe',
      email: 'john@example.com',
      phoneNo: '123-456-7890',
      banned: false,
    },
    {
      id: 2,
      username: 'JaneDoe',
      email: 'jane@example.com',
      phoneNo: '987-654-3210',
      banned: true,
    },
  ]);

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
      <div className="users-management">
        <h2>Users Management</h2>
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
                <td>{user.phoneNo}</td>
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