const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: false,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  location: {
    // Changed 'Location' to 'location' for consistency
    type: String,
  },
  Gender: {
    // Changed 'Gender' to 'gender' for consistency
    type: String,
    enum: ["Male", "Female", "Not to say"],
  },
  age: {
    // Added age field
    type: Number,
  },
  experience: {
    // Added experience field
    type: Number,
  },
  description: {
    // Added description field
    type: String,
  },
  skills: {
    // Added skills field as an array
    type: [String], // Array of strings
  },
  image: {
    // Added image field for the profile picture
    type: String,
  },
  phone: {
    type: Number,
  },
});
const userDB = mongoose.model("Users", userSchema);
module.exports = userDB;
