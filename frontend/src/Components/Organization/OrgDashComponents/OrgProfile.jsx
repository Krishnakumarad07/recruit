import React, { useState, useEffect } from "react";
import "./Orgprofile.css";
import OrgNav from "../OrgNav";
import axios from "axios";
import Swal from "sweetalert2";
var orgid = localStorage.getItem("org");
orgid = JSON.parse(orgid);
console.log(orgid);
const OrgProfile = () => {
  // State for profile details
  const [profile, setProfile] = useState({
    name: orgid.orgname || "",
    industry: orgid.Industry || "",
    establishedYear: orgid.Year || "",
    phone: orgid.phno || "",
    email: orgid.org_email || "",
    location: orgid.locn || "",
    // revenue: "",
    // employees: "",
    description: orgid.desc || "",
    services: orgid.Services || "",
    image: orgid.profImg
      ? orgid.profImg
      : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTiQo3Xa2nytgss_vWk0v6rcEf1yzIl5n62FQ&s",
  });
  const [isEditing, setIsEditing] = useState(false);

  // State for editing form fields
  const [editedProfile, setEditedProfile] = useState(profile);

  const handleEditClick = () => {
    setEditedProfile(profile); // Initialize with current profile data
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
  };
  const handleSaveClick = async (e) => {
    const loadingAlert = Swal.fire({
      title: "Submitting Ur Action...",
      html: "Please wait while we process your application.",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
    try {
      const updatedData = {
        ...editedProfile,
        name: profile.name, // Keep the original organization name
        email: profile.email, // Keep the original email from profile
      };
      setProfile(updatedData);
      setIsEditing(false); // Update the profile with edited data

      e.preventDefault();

      console.log(updatedData);
      const formData = new FormData();
      formData.append("file", updatedData.image); // Append the image file
      formData.append("name", updatedData.name);
      formData.append("email", updatedData.email);
      formData.append("establishedYear", updatedData.establishedYear);
      formData.append("phone", updatedData.phone);
      formData.append("description", updatedData.description);
      formData.append("industry", updatedData.industry);
      formData.append("location", updatedData.location);
      formData.append("services", updatedData.services);

      await axios
        .put("http://localhost:8081/orgauth/profUpdate", formData, {
          headers: {
            "Content-Type": "multipart/form-data", // Important for file upload
          },
        })
        .then((res) => {
          console.log("Profile updated:", res.data);
          localStorage.setItem("org", JSON.stringify(res.data));
          // alert("Profile Updated Successfully");
          loadingAlert.close();
          Swal.fire({
            title: "Success!",
            text: "Profile Updated Successfully",
            icon: "success",
          });
          window.location.reload();
        });

      // Optionally, redirect or show a success message
    } catch (err) {
      console.error("Error updating profile:", err);
      // alert("Unable To update");
      loadingAlert.close();
      Swal.fire({
        title: "Error!",
        text: "Unable to Update",
        icon: "error",
      });
      // Optionally, handle the error (e.g., show an error message)
    }
  };

  // Handle input changes in the form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value,
    }));
  };

  // Handle services input change
  const handleServicesChange = (e, index) => {
    const newServices = [...editedProfile.services];
    newServices[index] = e.target.value;
    setEditedProfile({ ...editedProfile, services: newServices });
  };
  //handle remove
  const handleRemoveService = (index) => {
    const newServices = [...editedProfile.services];
    newServices.splice(index, 1);
    setEditedProfile({ ...editedProfile, services: newServices });
  };
  // Add new service
  const handleAddService = () => {
    setEditedProfile({
      ...editedProfile,
      services: [...editedProfile.services, ""],
    });
  };

  // Handle profile image change during editing
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditedProfile({ ...editedProfile, image: file });
    }
  };

  return (
    <>
      <OrgNav />
      <div className="profile-container">
        {!isEditing ? (
          <div className="profile-content">
            {/* Profile Information Section */}
            <div className="profile-sidebar">
              <img
                src={profile.image}
                alt="Profile"
                className="profile-image"
              />
              <h2>{orgid.orgname}</h2>
              <p>{profile.industry}</p>
              <p className="profile-description">{profile.description}</p>

              <div className="skills">
                <h4>Services</h4>
                {profile.services.map((service, index) => (
                  <div key={index} className="skill-badge">
                    {service}
                  </div>
                ))}
              </div>
              <button className="edit-profile-btn" onClick={handleEditClick}>
                Edit
              </button>
            </div>

            {/* Basic Information Section */}
            <div className="profile-main">
              <center>
                {" "}
                <h3>Basic Information</h3>
              </center>
              <br />
              <br />
              <div className="basic-info">
                <div>
                  <p>
                    <strong>Established:</strong> {profile.establishedYear}
                  </p>
                  {/* <p><strong>Revenue:</strong> {profile.revenue}</p> */}
                </div>
                <div>
                  {/* <p><strong>Employees:</strong> {profile.employees}</p> */}
                  <p>
                    <strong>Location:</strong> {profile.location}
                  </p>
                </div>
                <div>
                  <p>
                    <strong>Phone:</strong> {profile.phone}
                  </p>
                  <p>
                    <strong>Email:</strong> {profile.email}
                  </p>
                </div>
              </div>
              {/* <div className="action-buttons">
                <button className="btn">Download Brochure</button>
              </div> */}
            </div>
          </div>
        ) : (
          <div className="edit-popup">
            <h3>Edit Organization Profile</h3>
            {/* Edit Form with Grid Layout */}
            <form className="edit-form" encType="multipart/form-data">
              <label>
                Organization Name:
                <input
                  type="text"
                  name="name"
                  value={editedProfile.name}
                  onChange={handleInputChange}
                />
              </label>
              <label>
                Industry:
                <input
                  type="text"
                  name="industry"
                  value={editedProfile.industry}
                  onChange={handleInputChange}
                />
              </label>
              <label>
                Established Year:
                <input
                  type="number"
                  name="establishedYear"
                  value={editedProfile.establishedYear}
                  onChange={handleInputChange}
                />
              </label>
              <label>
                Phone:
                <input
                  type="tel"
                  name="phone"
                  value={editedProfile.phone}
                  onChange={handleInputChange}
                />
              </label>
              <label>
                Email:
                <input
                  type="email"
                  name="email"
                  value={editedProfile.email}
                  onChange={handleInputChange}
                  disabled
                />
              </label>
              <label>
                Location:
                <input
                  type="text"
                  name="location"
                  value={editedProfile.location}
                  onChange={handleInputChange}
                />
              </label>
              {/* <label>
                Revenue:
                <input
                  type="text"
                  name="revenue"
                  value={editedProfile.revenue}
                  onChange={handleInputChange}
                />
              </label> */}
              {/* <label>
                Employees:
                <input
                  type="number"
                  name="employees"
                  value={editedProfile.employees}
                  onChange={handleInputChange}
                />
              </label> */}
              <label>
                Description:
                <textarea
                  name="description"
                  value={editedProfile.description}
                  onChange={handleInputChange}
                />
              </label>
              <label>
                Profile Image:
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </label>
              <label>
                Services:
                {editedProfile.services.map((service, index) => (
                  <div key={index}>
                    <input
                      type="text"
                      value={service}
                      onChange={(e) => handleServicesChange(e, index)}
                    />
                    <button
                      type="button"
                      id="remove"
                      onClick={() => handleRemoveService(index)}
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  className="view-bt"
                  onClick={handleAddService}
                >
                  Add Service
                </button>
              </label>
            </form>
            <div className="popup-buttons">
              <button className="btn" onClick={handleCancelClick}>
                Cancel
              </button>
              <button className="btn save-btn" onClick={handleSaveClick}>
                Save
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default OrgProfile;
