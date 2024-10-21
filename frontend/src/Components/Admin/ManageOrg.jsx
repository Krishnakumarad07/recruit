import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
const ManageOrg = () => {
  const [users, setUsers] = useState([]);
  const [showRemovePopup, setShowRemovePopup] = useState(false);
  const [orgToRemove, setOrgToRemove] = useState(null);
  const [showViewPopup, setShowViewPopup] = useState(false);
  const [viewingOrg, setViewingOrg] = useState(null);

  useEffect(() => {
    const getOrgDetails = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8081/adminauth/orgDetails"
        );
        setUsers(res.data.orgDetails || res.data); // Adjust based on your API response structure
      } catch (err) {
        console.log(err);
      }
    };
    getOrgDetails();
  }, []);

  // Function to handle remove organization
  const handleRemoveOrg = (_id, orgname, org_email) => {
    setOrgToRemove({ _id, orgname, org_email });
    setShowRemovePopup(true);
  };

  // Function to confirm remove organization
  const confirmRemoveOrg = async () => {
    if (orgToRemove) {
      const loadingAlert = Swal.fire({
        title: "Removing Organisation...",
        html: "Please wait till the process is completing.",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });
      try {
        console.log(orgToRemove);
        const res = await axios.delete(
          `http://localhost:8081/adminauth/removeOrg/${orgToRemove._id}`
        );
        if (res.status === 200) {
          // alert("Organization Removed Successfully");
          loadingAlert.close();
          Swal.fire({
            title: "Success!",
            text: " Organization Removed Successfully ",
            icon: "success",
          });
          setUsers(users.filter((user) => user._id !== orgToRemove._id));
          setShowRemovePopup(false);
        } else {
          // console.error('Error removing organization');
          loadingAlert.close();
          Swal.fire({
            title: "Error!",
            text: " Error removing organisation ",
            icon: "error",
          });
        }
      } catch (err) {
        loadingAlert.close();
        Swal.fire({
          title: "Error!",
          text: " Internal Error on removing organisation ",
          icon: "error",
        });
        setShowRemovePopup(false);
        console.error(err);
      }
    }
  };

  // Function to cancel remove organization
  const cancelRemoveOrg = () => {
    setShowRemovePopup(false);
  };

  // Function to handle view organization
  const handleViewOrg = (_id) => {
    const org = users.find((user) => user._id === _id);
    setViewingOrg(org);
    setShowViewPopup(true);
  };

  // Function to close view popup
  const closeViewPopup = () => {
    setShowViewPopup(false);
    setViewingOrg(null);
  };

  return (
    <>
      <div className="users-management1">
        <h2 id="hhh">Org Management</h2>
        <table className="users-tabl">
          <thead>
            <tr>
              <th>Organisation Name</th>
              <th>Email</th>
              <th>Phone Number</th>
              <th>Manage</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user.orgname}</td>
                <td>{user.org_email}</td>
                <td>{user.phno}</td>
                <td>
                  <button
                    id="view"
                    className="view-bt"
                    onClick={() => handleViewOrg(user._id)}
                  >
                    View
                  </button>
                  <button
                    id="remove"
                    onClick={() =>
                      handleRemoveOrg(user._id, user.orgname, user.org_email)
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

      {showRemovePopup && orgToRemove && (
        <div className="remove-popup">
          <h2>Confirm Remove Organization</h2>
          <p>
            Are you sure you want to remove {orgToRemove.orgname} with email id
            of {orgToRemove.org_email}?
          </p>
          <button onClick={confirmRemoveOrg}>Yes, remove</button>
          <button onClick={cancelRemoveOrg}>Cancel</button>
        </div>
      )}

      {showViewPopup && viewingOrg && (
        <div className="view-popup">
          <h2>Organization Information</h2>
          <p>Organization Name: {viewingOrg.orgname}</p>
          <p>Email: {viewingOrg.org_email}</p>
          <p>Phone Number: {viewingOrg.phno}</p>
          <p>Description: {viewingOrg.desc}</p>
          <p>Location: {viewingOrg.locn}</p>
          <p>Industry: {viewingOrg.Industry}</p>
          <p>Services: {viewingOrg.Services.join(", ")}</p>
          <p>Year Established: {viewingOrg.Year}</p>
          <button onClick={closeViewPopup}>Close</button>
        </div>
      )}
    </>
  );
};
export default ManageOrg;
