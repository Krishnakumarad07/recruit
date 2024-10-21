import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
const ManageUser = () => {
  const [users, setUsers] = useState([]);
  const [showRemovePopup, setShowRemovePopup] = useState(false);
  const [userToRemove, setUserToRemove] = useState(null);
  const [showViewPopup, setShowViewPopup] = useState(false);
  const [viewingUser, setViewingUser] = useState(null);

  useEffect(() => {
    const getUserDetails = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8081/adminauth/UserDetails"
        );
        setUsers(res.data.UserDetails);
      } catch (err) {
        console.log(err);
      }
    };
    getUserDetails();
  }, []);

  // Function to handle remove user
  const handleRemoveUser = (_id, username, email) => {
    setUserToRemove({ _id, username, email });
    setShowRemovePopup(true);
  };

  // Function to confirm remove user
  const confirmRemoveUser = async () => {
    if (userToRemove) {
      const loadingAlert = Swal.fire({
        title: "Removing User...",
        html: "Please wait till process is completing.",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });
      try {
        console.log(userToRemove._id);
        const res = await axios.delete(
          `http://localhost:8081/adminauth/UserDetailsDelete/${userToRemove._id}`
        );
        if (res.status === 200) {
          // alert("User Removed Successfully");
          loadingAlert.close();
          // console.error("Error on Removing application:", error);
          Swal.fire({
            title: "Success!",
            text: " User Removed Successfully ",
            icon: "success",
          });
          setUsers(users.filter((user) => user._id !== userToRemove._id));
          setShowRemovePopup(false);
        } else {
          // console.error('Error removing user');
          loadingAlert.close();
          Swal.fire({
            title: "Error!",
            text: " Error removing user ",
            icon: "error",
          });
        }
      } catch (err) {
        loadingAlert.close();
        Swal.fire({
          title: "Error!",
          text: " Internal Error on removing user ",
          icon: "error",
        });
        setShowRemovePopup(false);
        console.error(err);
      }
    }
  };

  // Function to cancel remove user
  const cancelRemoveUser = () => {
    setShowRemovePopup(false);
  };

  // Function to handle view user
  const handleViewUser = (_id) => {
    const user = users.find((user) => user._id === _id);
    setViewingUser(user);
    setShowViewPopup(true);
  };

  // Function to close view popup
  const closeViewPopup = () => {
    setShowViewPopup(false);
    setViewingUser(null);
  };

  return (
    <>
      <div className="users-management1">
        <h2 id="hhh">Users Management</h2>
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
              <tr key={user._id}>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{user.phone}</td>
                <td>
                  <button
                    id="view"
                    className="view-bt"
                    onClick={() => handleViewUser(user._id)}
                  >
                    View
                  </button>
                  <button
                    id="remove"
                    onClick={() =>
                      handleRemoveUser(user._id, user.username, user.email)
                    }
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showRemovePopup && userToRemove && (
        <div className="remove-popup">
          <h2>Confirm Remove User</h2>
          <p>
            Are you sure you want to remove {userToRemove.username} from user
            with email id of {userToRemove.email}
          </p>
          <button onClick={confirmRemoveUser}>Yes, remove</button>
          <button onClick={cancelRemoveUser}>Cancel</button>
        </div>
      )}

      {showViewPopup && viewingUser && (
        <div className="view-popup">
          <h2>User Information</h2>
          <p>Username: {viewingUser.username}</p>
          <p>Email: {viewingUser.email}</p>
          <p>Phone Number: {viewingUser.phone}</p>
          <p>Gender: {viewingUser.Gender}</p>
          <p>Age: {viewingUser.age}</p>
          <p>Description: {viewingUser.description}</p>
          <p>Experience: {viewingUser.experience} years</p>
          <p>Location: {viewingUser.location}</p>
          <p>Skills: {viewingUser.skills.join(", ")}</p>
          {/* {viewingUser.image && <img src={viewingUser.image} alt={`${viewingUser.username}'s avatar`} style={{ maxWidth: '100px', maxHeight: '100px' }} />} */}
          <button onClick={closeViewPopup}>Close</button>
        </div>
      )}
    </>
  );
};

export default ManageUser;
