const mongoose = require("mongoose");

const OrgSchema = new mongoose.Schema({
  orgname: {
    type: String,
    required: true,
    unique: true,
  },
  org_email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  Year: {
    type: Number,
    default: "0000",
  },
  desc: {
    type: String,
    default: "Lorem ipsum dolor",
  },
  Services: {
    type: [String],
    default: [],
  },
  Industry: {
    type: String,
    default: "",
  },
  phno: {
    type: Number,
    default: "",
  },
  locn: {
    type: String,
    default: "America",
  },
  profImg: {
    type: String,
    required: false,
  },
});

const OrgDB = mongoose.model("organisations", OrgSchema);
module.exports = OrgDB;
