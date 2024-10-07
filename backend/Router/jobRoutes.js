const express = require("express");
const router = express.Router();
const OrgDB = require("../Models/Orgmodel");
const cloudinary = require("../Models/cloudinary");
const multer = require("multer");
const fs = require("fs");
const AddJob = require("../Models/OrgJobs");
const Candidates = require("../Models/AppliedCandidate");
const ResumeScore = require("../ats");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAILID,
    pass: process.env.MAILPWD,
  },
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./orgUploads"); // Directory where files will be saved
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Rename file to avoid conflicts
  },
});

const upload = multer({ storage });

router.post("/applyjob", upload.single("file"), async (req, res) => {
  console.log(req.body); // Debugging: log incoming request body

  try {
      // Validate organization
      const org = await OrgDB.findOne({ orgname: req.body.orgname }, '_id');
      if (!org) {
          return res.status(404).json({ message: "Organization not found." });
      }

      // Check for existing application
      const existingApplication = await Candidates.findOne({
          email: req.body.email,
          Company: org._id, // Ensure field name matches schema
          jobType: req.body.jobType,
          position: req.body.position
      });
      console.log("", existingApplication);

      if (existingApplication) {
          console.log("exist")
          return res.status(409).json({ message: "Application already exists." });
      }

      // Fetch required skills for the job
      const job = await AddJob.findOne({
          company: org._id,
          jobType: req.body.jobType,
          position: req.body.position
      }, 'requiredSkills');

      if (!job) {
          console.log("job not found");
          return res.status(404).json({ message: "Job not found." });
      }

      var keywords = job.requiredSkills;
      keywords=Array.isArray(keywords) ? keywords : keywords.split(',');
      console.log(keywords)
      const score = await ResumeScore(req.file.path, keywords);
      console.log(score) // Await the score calculation

      // Upload resume to Cloudinary
      const cloudinaryResult = await cloudinary.uploader.upload(req.file.path, {
          folder: 'orgUploads',
      });

      // Create application data
      const applicationData = {
          Company: org._id,
          position: req.body.position,
          jobType: req.body.jobType,
          name: req.body.name,
          email: req.body.email,
          Gender: req.body.Gender,
          dateOfBirth: req.body.dateOfBirth,
          address: req.body.address,
          state: req.body.state,
          country: req.body.country,
          educationqualification: req.body.education,
          percentage: req.body.percentage,
          resume: cloudinaryResult.secure_url,
          phone: req.body.phone,
          status: score < 2 ? "Rejected" : "waiting",
      };
      // db.candidates.dropIndex("email_1");

      // Save application to database
      const newApplication = new Candidates(applicationData);
      await newApplication.save();
      const { status, ...applicationDataWithoutStatus } = applicationData;
      const mailOptions = {
          from: `"${req.body.orgname}" <${process.env.MAILID}>`,
          to: req.body.email,
          subject: "Application Confirmation",
          text: `You're successfully applied for the '${req.body.orgname}' company for the role of '${req.body.position}'. The details you applied are: ${JSON.stringify(applicationDataWithoutStatus, null, 2)}. Your current status is '${status}'.`,
          html: `<!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px; }
        h2 { color: #333; }
        p { color: #555; }
        .footer { font-size: 12px; color: #777; margin-top: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <h2>Hello ${req.body.name},</h2>
        <p>You're successfully applied for the <strong>'${req.body.orgname}'</strong> company for the role of <strong>'${req.body.position}'</strong>.</p>
        <p>The details you applied are:</p>
        <pre>${JSON.stringify(applicationDataWithoutStatus, null, 2)}</pre>
        <p>Your current status is: <strong>'${status}'</strong>.</p>
        <p>If you did not apply for this position, please contact support.</p>
        <div class="footer">
          <p>Best regards,<br>Smart Recruiter Team</p>
        </div>
      </div>
    </body>
    </html>`,
        };
    
        // Send the email
      await transporter.sendMail(mailOptions);
      // Optionally delete the uploaded file after processing
      fs.unlink(req.file.path, (err) => {
          if (err) console.log('Error deleting file:', err);
      }

          

                // Send confirmation email
               
      );

      return res.status(201).json({ message: "Application submitted successfully." });

  } catch (err) {
      console.log("Error occurred:", err);
      return res.status(500).json({ message: "An error occurred", error: err.message });
  }
});
router.delete("/deletejob/:id", async (req, res) => {
  try {
    console.log(req.params);
    await AddJob.findByIdAndDelete(req.params.id);
    return res.status(200).json({ message: "deleted successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Error deleting job", err });
  }
});

router.get("/AppliedJob", async (req, res) => {
  try {
    email = req.query.email;
    console.log(email);
    const AppDetails = await Candidates.find({ email }).populate(
      "Company",
      "orgname"
    );

    console.log(AppDetails);
    return res.status(200).json(AppDetails);
  } catch (err) {
    console.error(err);
  }
});

router.get("/Applicants", async (req, res) => {
  try {
    const id = req.query.id;
    console.log(id);
    const Applicants = await Candidates.find({ Company: id });
    // console.log(Applicants);
    return res.status(200).json(Applicants);
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
