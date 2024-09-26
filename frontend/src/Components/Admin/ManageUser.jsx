import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ManageUser = () => {
  const [users, setUsers] = useState(['']);
  const [showRemovePopup, setShowRemovePopup] = useState(false);
  const [userIdToRemove, setUserIdToRemove] = useState(null);

  useEffect(() => {
    const getUserDetails = async () => {
      try {
        const res = await axios.get("http://localhost:8081/adminauth/UserDetails");
        setUsers(res.data.UserDetails);
      } catch (err) {
        console.log(err);
      }
    };
    getUserDetails();
  }, []);

  // Function to handle remove user
  const handleRemoveUser = (id) => {
    setUserIdToRemove(id);
    setShowRemovePopup(true);
  };

  // Function to confirm remove user
  const confirmRemoveUser = async () => {
    // try {
    //   const res = await axios.delete(`http://localhost:8081/`);
    //   if (res.status === 200) {
    //     setUsers(users.filter((user) => user.id !== userIdToRemove));
    //     setShowRemovePopup(false);
    //   } else {
    //     console.error('Error removing user');
    //   }
    // } catch (err) {
    //   console.error(err);
    // }
  };

  // Function to cancel remove user
  const cancelRemoveUser = () => {
    setShowRemovePopup(false);
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
                  <button id='remove'onClick={() => handleRemoveUser(user.id)}>Remove</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showRemovePopup && (
        <div className="remove-popup">
          <h2>Confirm Remove User</h2>
          <p>Are you sure you want to remove user with ID {userIdToRemove}?</p>
          <button onClick={confirmRemoveUser}>Yes, remove</button>
          <button onClick={cancelRemoveUser}>Cancel</button>
        </div>
      )}
    </>
  );
};

export default ManageUser;