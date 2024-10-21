const express = require("express");
const router = express.Router();
const UserDB = require("../Models/UserModel");
const OrgDB = require("../Models/Orgmodel");
const JobsDB = require("../Models/OrgJobs");
const AdminDB = require("../Models/admin");
const nodemailer = require("nodemailer");
const Candidates = require("../Models/AppliedCandidate");
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAILID,
    pass: process.env.MAILPWD,
  },
});
router.get("/allcount", async (req, res) => {
  try {
    const UserCount = (await UserDB.countDocuments()) || 0;
    const OrgCount = (await OrgDB.countDocuments()) || 0;
    const JobCount = (await JobsDB.countDocuments()) || 0;

    return res.status(200).json({
      UserCount,
      OrgCount,
      JobCount,
    });
  } catch (error) {
    console.error(error); // Log the error for debugging
    return res
      .status(500)
      .json({ message: "Data can't be fetched", error: error.message });
  }
});
router.get("/UserDetails", async (req, res) => {
  try {
    const UserDetails = (await UserDB.find()) || "";
    return res.status(200).json({ UserDetails });
  } catch (error) {
    console.error(error); // Log the error for debugging
    return res
      .status(500)
      .json({ message: "Data can't be fetched", error: error.message });
  }
});
router.get("/orgDetails", async (req, res) => {
  try {
    const orgDetails = (await OrgDB.find()) || "";
    return res.status(200).json({ orgDetails });
  } catch (error) {
    console.error(error); // Log the error for debugging
    return res
      .status(500)
      .json({ message: "Data can't be fetched", error: error.message });
  }
});
router.get("/JobDetails", async (req, res) => {
  try {
    const JobDetails =
      (await JobsDB.find({}).populate("company", "orgname _id org_email")) ||
      "";
    // console.log(JobDetails);
    return res.status(200).json({ JobDetails });
  } catch (error) {
    console.error(error); // Log the error for debugging
    return res
      .status(500)
      .json({ message: "Data can't be fetched", error: error.message });
  }
});

router.delete("/UserDetailsDelete/:id", async (req, res) => {
  try {
    console.log(req.params.id);
    const user = await UserDB.findByIdAndDelete(req.params.id);
    //   console.log(user);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    console.log(user.email);

    // Send removal email
    const mailOptions = {
      from: `"Recruit" <${process.env.MAILID}>`,
      to: user.email,
      subject: "Account Removal Notification",
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
            <h2>Hello ${user.username},</h2>
            <p>We want to inform you that your account has been removed by the admin.</p>
            <p>If you believe this is a mistake or if you have any questions, please contact support.</p>
            <div class="footer">
              <p>Best regards,<br>Recruit's Team</p>
            </div>
          </div>
        </body>
        </html>`,
    };

    // Send the email
    await transporter.sendMail(mailOptions);
    console.log("User removed successfully and email sent.");
    return res
      .status(200)
      .json({ message: "User removed successfully and email sent." });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

router.delete("/removeOrg/:id", async (req, res) => {
  try {
    const companyId = req.params.id;
    console.log(companyId); // Log the received company ID

    // Find users associated with the given company ID
    const users = await Candidates.find(
      { Company: companyId },
      "email Company name status _id"
    ).populate("Company", "orgname");
    const orgName =
      users.length > 0 ? users[0].Company.orgname : "the organization";

    const uniqueEmails = [];
    const seenEmails = new Set();

    // Filter users based on status and ensure unique emails
    users.forEach((user) => {
      if (
        !seenEmails.has(user.email) &&
        user.status !== "selected" &&
        user.status !== "rejected"
      ) {
        seenEmails.add(user.email);
        uniqueEmails.push(user.email); // Push only the email string
      }
    });

    console.log(uniqueEmails);

    // Send emails to unique applicants
    if (uniqueEmails.length > 0) {
      const mailOptions = {
        from: `"Recruit" <${process.env.MAILID}>`,
        to: uniqueEmails.join(","), // Join unique emails as a string
        subject: "Organization Deletion Notification",
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
              <h2>Hello Customer,</h2>
              <p>We want to inform you that the Organization ${orgName} has been deleted by the admin.</p>
              <p>As a result, the jobs related to this company that you applied also been removed. We apologize for the inconvenience.</p>
              <div class="footer">
                <p>Best regards,<br>Recruit's Team</p>
              </div>
            </div>
          </body>
          </html>`,
      };

      await transporter.sendMail(mailOptions);
      console.log("Emails sent successfully.");
    } else {
      console.log("No emails to send.");
    }

    // Find the organization to send a notification
    const organization = await OrgDB.findById(companyId);
    if (organization) {
      const orgMailOptions = {
        from: `"Recruit" <${process.env.MAILID}>`,
        to: organization.org_email, // Assuming the organization has an email field
        subject: "Your Organization has been Deleted",
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
              <h2>Hello ${organization.orgname},</h2>
              <p>Your organization ${organization.orgname} has been deleted by the admin.</p>
              <p>Consequently, all jobs relevant to your organization have also been removed.</p>
              <div class="footer">
                <p>Best regards,<br>Recruit's Team</p>
              </div>
            </div>
          </body>
          </html>`,
      };

      await transporter.sendMail(orgMailOptions);
      console.log(
        `Notification sent to organization: ${organization.org_email}`
      );
    }

    // Delete all documents in the users variable from Mongoose
    await Candidates.deleteMany({ Company: companyId });
    console.log("All associated candidates have been deleted.");

    // Delete the organization
    await OrgDB.findByIdAndDelete(companyId);
    console.log("Organization deleted.");

    // Delete all jobs related to the organization
    await JobsDB.deleteMany({ company: companyId }); // Adjust the field name if necessary
    console.log("All related jobs have been deleted.");

    return res
      .status(200)
      .json({
        message: "Organization removed, notifications sent, and data deleted.",
      });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.delete("/JobDetailsDelete/:id", async (req, res) => {
  const jobId = req.params.id;

  try {
    // Find the job and populate the company field
    const job = await JobsDB.findById(jobId).populate("company"); // Populate to get company details
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Prepare user details and job details for email
    const user = {
      email: job.company.org_email,
      organizationName: job.company.orgname,
    };
    const position = job.position;
    const jobType = job.jobType;

    // Mail options
    const mailOptions = {
      from: `"Recruit" <${process.env.MAILID}>`,
      to: user.email,
      subject: "Job Deletion Notification",
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
          <h2>Hello ${user.organizationName},</h2>
          <p>Your job posted for role <strong>${position}</strong> (${jobType}) by your organization <strong>${user.organizationName}</strong> has been deleted by the admin.</p>
          <p>If you believe this is a mistake or if you have any questions, please contact support.</p>
          <div class="footer">
            <p>Best regards,<br>Recruit's Team</p>
          </div>
        </div>
      </body>
      </html>`,
    };

    // Send email notification
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");

    // Now delete the job
    await JobsDB.findByIdAndDelete(jobId);
    console.log("Job deleted successfully");
    res
      .status(200)
      .json({ message: "Job deleted and email sent successfully." });
  } catch (error) {
    console.error("Error deleting job:", error);
    res.status(500).json({ message: "Error deleting job.", error });
  }
});

router.post("/adminadd", async (req, res) => {
  try {
    const { adminname, adminEmail, adminPassword } = req.body;
    console.log(adminname);
    console.log(adminEmail);
    console.log(adminPassword);
    const existadmin = await AdminDB.findOne({ adminEmail });
    if (existadmin) {
      return res.status(500).json({ message: "The Admin Already Exists" });
    }
    const newadmin = new AdminDB({ adminname, adminEmail, adminPassword });
    const admin = await newadmin.save();
    return res.status(200).json(admin);
  } catch (error) {
    return res.status(404).send(error);
  }
});
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    // console.log(email)
    // console.log(password)
    const AdminDetails = await AdminDB.findOne({ adminEmail: email });
    if (!AdminDetails) {
      return res.status(500).json({ message: "No Admin Is available" });
    }
    if (AdminDetails.adminPassword !== password) {
      return res.status(500).json({ message: "Incorrect Password" });
    } else {
      return res.status(200).json(AdminDetails);
    }
  } catch (error) {
    return res.status(404).json({ message: "error" });
  }
});

module.exports = router;
