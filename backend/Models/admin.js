const mongoose = require("mongoose");
const adminSchema = new mongoose.Schema({
  adminname: {
    type: String,
    required: true,
  },
  adminEmail: {
    type: String,
    required: true,
    unique: true,
  },
  adminPassword: {
    type: String,
    required: true,
  },
});

const adminDB = mongoose.model("admin", adminSchema);
module.exports = adminDB;
