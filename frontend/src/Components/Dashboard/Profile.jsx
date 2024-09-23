import React, { useState } from 'react';
import './Profile.css';
import Navside from './Navside';

const Profile = () => {
  // State for profile details
  const [profile, setProfile] = useState({
    name: "Charan Guru",
    jobTitle: "UI/UX Designer",
    age: 28,
    phone: "+91 95123 56789",
    email: "ananya.sharma@gmail.com",
    location: "Ahmedabad, Gujarat",
    ctc: "12.5 Lacs",
    experience: 6,
    description: "Full stack product designer with hands-on experience in solving problems for clients ranging from healthcare, real estate, and industries.",
    skills: ["UI/UX", "Adobe XD", "Wireframing", "Information Architecture"],
    image: "https://via.placeholder.com/120", // Initial placeholder image
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

  const handleSaveClick = () => {
    setProfile(editedProfile); // Update the profile with edited data
    setIsEditing(false);
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
    setEditedProfile({ ...editedProfile, skills: [...editedProfile.skills, ""] });
  };

  // Handle profile image change during editing
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditedProfile({ ...editedProfile, image: URL.createObjectURL(file) });
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
              <h2>{profile.name}</h2>
              <p>{profile.jobTitle}</p>
              <p className="profile-description">{profile.description}</p>

              <div className="skills">
                <h4>Skills</h4>
                {profile.skills.map((skill, index) => (
                  <div key={index} className="skill-badge">{skill}</div>
                ))}
              </div>
              <button className="edit-profile-btn" onClick={handleEditClick}>
                Edit
              </button>
            </div>

            {/* Basic Information Section */}
            <div className="profile-main">
              <h3>Basic Information</h3>
              <div className="basic-info">
                <div>
                  <p><strong>Age:</strong> {profile.age} years</p>
                  <p><strong>CTC:</strong> {profile.ctc}</p>
                </div>
                <div>
                  <p><strong>Years of Experience:</strong> {profile.experience} years</p>
                  <p><strong>Location:</strong> {profile.location}</p>
                </div>
                <div>
                  <p><strong>Phone:</strong> {profile.phone}</p>
                  <p><strong>Email:</strong> {profile.email}</p>
                </div>
              </div>
              <div className="action-buttons">
                <button className="btn">Download Resume</button>
              </div>
              <hr />
              <hr />
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
                Job Title:
                <input
                  type="text"
                  name="jobTitle"
                  value={editedProfile.jobTitle}
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
                CTC:
                <input
                  type="text"
                  name="ctc"
                  value={editedProfile.ctc}
                  onChange={handleInputChange}
                />
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
                <input type="file" accept="image/*" onChange={handleImageChange} />
              </label>
              <label>
                Skills:
                {editedProfile.skills.map((skill, index) => (
                  <input
                    key={index}
                    type="text"
                    value={skill}
                    onChange={(e) => handleSkillsChange(e, index)}
                  />
                ))}
                <button type="button" onClick={handleAddSkill}>Add Skill</button>
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
