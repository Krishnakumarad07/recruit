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
    const org = await OrgDB.findOne({ orgname: req.body.orgname }, "_id");
    if (!org) {
      return res.status(404).json({ message: "Organization not found." });
    }

    // Check for existing application
    const existingApplication = await Candidates.findOne({
      email: req.body.email,
      Company: org._id,
      jobType: req.body.jobType,
      position: req.body.position,
    });

    if (existingApplication) {
      console.log("exist");
      return res.status(409).json({ message: "Application already exists." });
    }

    // Fetch required skills for the job
    const job = await AddJob.findOne(
      {
        company: org._id,
        jobType: req.body.jobType,
        position: req.body.position,
      },
      "requiredSkills"
    );

    if (!job) {
      console.log("job not found");
      return res.status(404).json({ message: "Job not found." });
    }

    var keywords = job.requiredSkills;
    keywords = Array.isArray(keywords) ? keywords : keywords.split(",");
    const score = await ResumeScore(req.file.path, keywords);
    console.log(score);

    // Upload resume to Cloudinary
    const cloudinaryResult = await cloudinary.uploader.upload(req.file.path, {
      folder: "orgUploads",
      resource_type: "raw",
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
      isats: score< 2 ? false : true,
    };

    // Save application to database
    const newApplication = new Candidates(applicationData);
    await newApplication.save();
    const { status, ...applicationDataWithoutStatus } = applicationData;

    let mailOptions;

    // Determine email content based on application status
    if (status === "Rejected") {
      mailOptions = {
        from: `"${req.body.orgname}" <${process.env.MAILID}>`,
        to: req.body.email,
        subject: "Application Status: Rejected",
        text: `We regret to inform you that your application for the role of '${req.body.position} for
        ${req.body.jobType}' at '${req.body.orgname}' has been rejected by our ATS algorithm. We wish you the best in your future endeavors.`,
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
            <h2>Dear ${req.body.name},</h2>
            <p>We regret to inform you that your application for the role of <strong>'${req.body.position} for ${req.body.jobType}'</strong> at <strong>'${req.body.orgname}'</strong> has been rejected by our ATS algorithm.</p>
            <p>We wish you the best in your future endeavors.</p>
            <div class="footer">
              <p>Best regards,<br>Recruit's Team</p>
            </div>
          </div>
        </body>
        </html>`,
      };
    } else {
      mailOptions = {
        from: `"${req.body.orgname}" <${process.env.MAILID}>`,
        to: req.body.email,
        subject: "Application Confirmation",
        text: `You're successfully applied for the '${
          req.body.orgname
        }' company for the role of '${req.body.position}for ${
          req.body.jobType
        }'. The details you applied are: ${JSON.stringify(
          applicationDataWithoutStatus,
          null,
          2
        )}. Your current status is '${status}'.`,
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
            <p>You're successfully applied for the <strong>'${
              req.body.orgname
            }'</strong> company for the role of <strong>'${
          req.body.position
        } for ${req.body.jobType}'</strong>.</p>
            <p>The details you applied are:</p>
            <pre>${JSON.stringify(applicationDataWithoutStatus, null, 2)}</pre>
            <p>Your current status is: <strong>'${status}'</strong>.</p>
            <p>If you did not apply for this position, please contact support.</p>
            <div class="footer">
              <p>Best regards,<br>Recruit's Team</p>
            </div>
          </div>
        </body>
        </html>`,
      };
    }

    // Send the email
    await transporter.sendMail(mailOptions);

    // Optionally delete the uploaded file after processing
    fs.unlink(req.file.path, (err) => {
      if (err) console.log("Error deleting file:", err);
    });

    return res
      .status(201)
      .json({ message: "Application submitted successfully." });
  } catch (err) {
    console.log("Error occurred:", err);
    return res
      .status(500)
      .json({ message: "An error occurred", error: err.message });
  }
});
router.delete("/deletejob/:id", async (req, res) => {
  try {
    // console.log(req.params);
    await AddJob.findByIdAndDelete(req.params.id);
    return res.status(200).json({ message: "deleted successfully" });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: "Error deleting job", err });
  }
});

router.get("/AppliedJob", async (req, res) => {
  try {
    email = req.query.email;
    // console.log(email);
    const AppDetails = await Candidates.find({ email }).populate(
      "Company",
      "orgname"
    );

    // console.log(AppDetails);
    return res.status(200).json(AppDetails);
  } catch (err) {
    console.error(err);
  }
});

router.get("/Applicants", async (req, res) => {
  try {
    const id = req.query.id;
    // console.log(id);
    const Applicants = await Candidates.find({ Company: id,isats:{$ne:false} });
    // console.log(Applicants);
    return res.status(200).json(Applicants);
  } catch (err) {
    console.log(err);
  }
});
router.delete("/RemoveApplicants/:jobid", async (req, res) => {
  try {
    const JobApplicant = await Candidates.findByIdAndDelete({
      _id: req.params.jobid,
    }).populate("Company", "orgname");
    // console.log(JobApplicant);
    if (
      JobApplicant.status !== "Selected" &&
      JobApplicant.status !== "Rejected"
    ) {
      const mailOptions = {
        from: `"${JobApplicant.Company.orgname}" <${process.env.MAILID}>`,
        to: JobApplicant.email,
        subject: "Application Status Update",
        text: `We regret to inform you that your application for the role of '${JobApplicant.position}' at '${JobApplicant.Company.orgname}' has been removed.`,
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
      <h2>Hello ${JobApplicant.name},</h2>
      <p>We regret to inform you that your application for the role of <strong>'${JobApplicant.position}'</strong> at <strong>'${JobApplicant.Company.orgname}'</strong> has been removed by organisation.</p>
      <p>If you have any questions or believe this was a mistake, please contact support.</p>
      <div class="footer">
        <p>Best regards,<br>Recruit's Team</p>
      </div>
    </div>
  </body>
  </html>`,
      };

      // Send the email
      await transporter.sendMail(mailOptions);
    }
    return res.status(200).json({ message: "Deleted Successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error On deleting the User" });
  }
});

router.post("/SelectApplicantStatus", async (req, res) => {
  var { _id, status, selectedDate, selectedTime } = req.body;
  console.log(_id);
  console.log(status);
  console.log(selectedDate);
  selectedTime = selectedTime.toString();
  console.log(selectedTime);
  try {
    // Find the applicant in the database
    const applicant = await Candidates.findById(_id).populate(
      "Company",
      "orgname"
    );
    if (!applicant) {
      return res.status(404).send("Applicant not found");
    }

    // Update the status in the database
    applicant.status = status;

    // Combine selected date and time into a single Date object
    if (selectedDate && selectedTime) {
      const hrRoundDateAndTime = new Date(`${selectedDate}T${selectedTime}:00`);
      applicant.hrRoundDateAndTime = hrRoundDateAndTime; // Store in the database
    }
    console.log(applicant.hrRoundDateAndTime);
    // Prepare email content
    let mailOptions;

    switch (status) {
      case "round-1":
      case "round-2":
      case "Technical":
        mailOptions = {
          from: `"${applicant.Company.orgname}" <${process.env.MAILID}>`, // Assuming Company is a string in your model
          to: applicant.email,
          subject: "Application Status Update",
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
                      <h2>Hello ${applicant.name},</h2>
                      <p>Congrats! You're selected for the <strong>${status}</strong> round for the role of <strong>'${applicant.position}'</strong> at <strong>'${applicant.Company.orgname}'</strong>. The round will be conducted on our official website. Check accordingly.</p>
                      <div class="footer">
                        <p>Best regards,<br>Recruit's Team</p>
                      </div>
                    </div>
                  </body>
                  </html>`,
        };
        break;

      case "HR":
        applicant.hrRoundLink = process.env.MEET; // Store the meeting link in the applicant's record
        mailOptions = {
          from: `"${applicant.Company.orgname}" <${process.env.MAILID}>`,
          to: applicant.email,
          subject: "HR Round Invitation",
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
                      <h2>Hello ${applicant.name},</h2>
                      <p>Congrats! You're selected for the HR round for the <strong>'${
                        applicant.position
                      }'</strong> at <strong>'${
            applicant.Company.orgname
          }'</strong>. Here is your date and time for the meeting: <strong>${applicant.hrRoundDateAndTime.toLocaleString()}</strong>.</p>
                      <p>Meeting Link: <strong>${
                        applicant.hrRoundLink
                      }</strong></p> <!-- Use hrRoundLink here -->
                      <div class="footer">
                        <p>Best regards,<br>Recruit's Team</p>
                      </div>
                    </div>
                  </body>
                  </html>`,
        };
        break;

      case "Selected":
        mailOptions = {
          from: `"${applicant.Company.orgname}" <${process.env.MAILID}>`,
          to: applicant.email,
          subject: "Congratulations on Your Selection!",
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
                      <h2>Hello ${applicant.name},</h2>
                      <p>Congratulations! You have been selected for the role of <strong>'${applicant.position}'</strong> at <strong>'${applicant.Company.orgname}'</strong>. Our HR team will contact you within working days regarding your joining.</p>
                      <div class="footer">
                        <p>Best regards,<br>Recruit's Team</p>
                      </div>
                    </div>
                  </body>
                  </html>`,
        };
        break;

      case "Rejected":
        mailOptions = {
          from: `"${applicant.Company.orgname}" <${process.env.MAILID}>`,
          to: applicant.email,
          subject: "Application Status Update",
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
                      <h2>Hello ${applicant.name},</h2>
                      <p>We regret to inform you that your application for the role of <strong>'${applicant.position}'</strong> at <strong>'${applicant.Company.orgname}'</strong> has been Rejected by the organisation.</p>
                      <p>We wish you the best for your future endeavors.</p>
                      <p>— ${applicant.Company.orgname}</p>
                      <p>If you have any questions, please contact support.</p>
                      <div class="footer">
                        <p>Best regards,<br>Recruit's Team</p>
                      </div>
                    </div>
                  </body>
                  </html>`,
        };
        break;

      default:
        return res.status(400).send("Invalid status");
    }

    // Send email
    await transporter.sendMail(mailOptions);

    // Save the updated applicant
    await applicant.save();

    return res.status(200).send("Status updated and email sent");
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
