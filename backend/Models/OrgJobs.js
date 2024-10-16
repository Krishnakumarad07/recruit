const mongoose = require("mongoose");

const AddJobsSchema = new mongoose.Schema({
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "organisations",
    require: true,
  },
  position: {
    type: String,
  },
  location: {
    type: String,
  },
  jobType: {
    type: String,
    enum: ["Full-Time", "Part-Time"],
  },
  jobPosted: {
    type: Date,
  },
  jobDeadline: {
    type: Date,
  },
  vacancy: {
    type: Number,
  },
  requiredSkills: {
    type: [String],
  },
  salary: {
    type: String,
  },
  jobDescription: {
    type: String,
  },
  jobFacilities: {
    type: [String],
  },
  IsOpened: {
    type: Boolean,
  },
});

const AddJob = mongoose.model("OrgAddJob", AddJobsSchema);
module.exports = AddJob;
