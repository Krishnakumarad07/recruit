import React, { useState } from "react";
import "./Profile.css";
import Navside from "./Navside";
import axios from "axios";
import Swal from "sweetalert2";
var details = localStorage.getItem("user");
details = JSON.parse(details);

const Profile = () => {
  const [profile, setProfile] = useState({
    name: details.username || "",
    age: details.age || 0,
    phone: details.phone || "",
    email: details.email || "",
    location: details.location || "",
    Gender: details.Gender || "",
    experience: details.experience || 0,
    description: details.description || "",
    skills: details.skills || [],
    image:
      details.image ||
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSY3Ev1b6Sb7M4DgNkOHViL12jqOxNcecmg5A&s",
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
    e.preventDefault(); // Move this to the top
    const loadingAlert = Swal.fire({
      title: "Submitting Ur Action...",
      html: "Please wait while we process your application.",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
    const { email, ...updatedProfile } = editedProfile;

    try {
      const newProfile = {
        ...updatedProfile,
        email: profile.email, // Keep the original email
      };
      setProfile(newProfile); // Update profile state here after a successful request
      setIsEditing(false);
      const formData = new FormData();
      formData.append("file", editedProfile.image); // Now this should be a File object
      formData.append("name", newProfile.name);
      formData.append("age", newProfile.age);
      formData.append("email", newProfile.email);
      formData.append("phone", newProfile.phone);
      formData.append("description", newProfile.description);
      formData.append("location", newProfile.location);
      formData.append("Gender", newProfile.Gender);
      formData.append("experience", newProfile.experience);
      newProfile.skills.forEach((skill, index) => {
        formData.append(`skills[${index}]`, skill);
      });

      const res = await axios.put(
        "http://localhost:8081/userauth/profUpdate",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Profile updated:", res.data);
      localStorage.setItem("user", JSON.stringify(res.data));
      // alert("Profile Updated Successfully");
      loadingAlert.close();
      Swal.fire({
        title: "Success!",
        text: "Profile Updated Successfully",
        icon: "success",
      });
      window.location.reload();

      // Close editing mode
    } catch (err) {
      console.error("Error updating profile:", err);
      // alert("Unable to update");
      loadingAlert.close();
      Swal.fire({
        title: "Error!",
        text: "Unable to update",
        icon: "error",
      });
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

  // Handle skill input change
  const handleSkillsChange = (e, index) => {
    const newSkills = [...editedProfile.skills];
    newSkills[index] = e.target.value;
    setEditedProfile({ ...editedProfile, skills: newSkills });
  };

  // Add new skill
  const handleAddSkill = () => {
    setEditedProfile({
      ...editedProfile,
      skills: [...editedProfile.skills, ""],
    });
  };

  // handle remove
  const handleRemoveSkill = (index) => {
    const newSkills = [...editedProfile.skills];
    newSkills.splice(index, 1);
    setEditedProfile({ ...editedProfile, skills: newSkills });
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
      <Navside />
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
              <h2 className="pro-name">{profile.name}</h2>
              <p className="profile-description">{profile.description}</p>

              <div className="skills">
                <h4>Skills</h4>
                {profile.skills.map((skill, index) => (
                  <div key={index} className="skill-badge">
                    {skill}
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
                <h3>Basic Information</h3>
              </center>
              <br />
              <br />
              <div className="basic-info">
                <div>
                  <p>
                    <strong>Age:</strong> {profile.age} years
                  </p>
                  <p>
                    <strong>Gender:</strong> {profile.Gender}
                  </p>
                </div>
                <div>
                  <p>
                    <strong>Years of Experience:</strong> {profile.experience}{" "}
                    years
                  </p>
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
                <button className="btn">Download Resume</button>
              </div> */}
            </div>
          </div>
        ) : (
          <div className="edit-popup">
            <h3>Edit Profile</h3>
            {/* Edit Form with Grid Layout */}
            <form className="edit-form">
              <label>
                Name:
                <input
                  type="text"
                  name="name"
                  value={editedProfile.name}
                  onChange={handleInputChange}
                />
              </label>
              <label>
                Age:
                <input
                  type="number"
                  name="age"
                  value={editedProfile.age}
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
              <label>
                Gender:
                <select
                  name="Gender"
                  value={editedProfile.Gender}
                  onChange={handleInputChange}
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Not to say">Not to say</option>
                </select>
              </label>
              <label>
                Years of Experience:
                <input
                  type="number"
                  name="experience"
                  value={editedProfile.experience}
                  onChange={handleInputChange}
                />
              </label>
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
                Skills:
                {editedProfile.skills.map((skill, index) => (
                  <div key={index}>
                    <input
                      type="text"
                      value={skill}
                      onChange={(e) => handleSkillsChange(e, index)}
                    />
                    <button
                      type="button"
                      className="remove"
                      id="remove"
                      onClick={() => handleRemoveSkill(index)}
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  className="view-bt"
                  onClick={handleAddSkill}
                >
                  Add Skill
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

export default Profile;
