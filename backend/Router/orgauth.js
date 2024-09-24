const express = require('express');
const router = express.Router();
const OrgDB = require('../Models/Orgmodel');
const cloudinary=require("../Models/cloudinary");
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const nodemailer= require("nodemailer");
const multer= require("multer");
const path=require("path");
const fs=require("fs");
const AddJob=require("../Models/OrgJobs");


dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || 'fallbackkey';
// // Set up multer for local storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './orgUploads'); // Directory where files will be saved
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`); // Rename file to avoid conflicts
    }
});
const upload = multer({storage});
router.post('/signup', async (req, res) => {
    try {
        const { orgname, org_email, password } = req.body;

        // Check if the Organisation already exists
        const existingOrg = await OrgDB.findOne({ orgname,org_email });
        if (existingOrg) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Register the organisation
        const newOrganisation = new OrgDB({
            orgname,
            org_email,
            password,  // Store the plain text password
        });
        const org = await newOrganisation.save();

        // Generate a JWT token
        const token = jwt.sign(
            { id: org._id, orgusername: org.orgname, org_email: org.org_email },
            JWT_SECRET,
        );

        res.json({
            message: 'Organisation Registered successfully',
            token,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});


router.post('/login', async (req, res) => {
    try {
        const { orgname,org_email, password } = req.body;

        // Find the organisation by email
        const org = await OrgDB.findOne({org_email});
        if (!org) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        if (org.orgname != orgname)
        {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Check if the password matches
        if (org.password !== password) {  // Compare plain text passwords
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate a JWT token
        const token = jwt.sign(
            {orgdetails: org},
            JWT_SECRET,
        );

        res.json({
            message: 'Login successful',
            token,
        });
    } catch (err) {
        res.status(500).json(err);
    }
});

router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;

    try {
        // Find the user by email
        const org = await OrgDB.findOne({ org_email:email });
        if (!org) {
            return res.status(404).json({ message: 'No such email in DB' });
        }

        // Configure Nodemailer transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.MAILID,
                pass: process.env.MAILPWD,
            }
        });

        // Configure the email options
        const mailOptions = {
            from: `"Smart Recruiter" <${process.env.MAILID}>`,
            to: org.org_email,
            subject: 'Regarding Forgot Password',
            text: `Your password is: ${org.password}`, // Plain text
            html: `<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px; }
    h2 { color: #333; }
    p { color: #555; }
    a { color: #1a73e8; text-decoration: none; }
    .footer { font-size: 12px; color: #777; margin-top: 20px; }
  </style>
</head>
<body>
  <div class="container">
    <h2>Dear Organization ${(org.orgname).charAt(0).toUpperCase()+(org.orgname).slice(1)},</h2>
    <p>We received a request to for your password. </p>
    <p><h5>Here is Your Password:<mark>${org.password}</mark></h5></p>
    <p>If you did not request this change, please ignore this email or contact support if you have questions.</p>
    <div class="footer">
      <p>Best regards,<br>Smart Recruiter Team</p>
    </div>
  </div>
</body>
</html>
`,
        };

        // Send the email
        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: 'Password sent to email' });
    } catch (err) {
        res.status(500).json({ message: 'Error sending password', error: err });
    }
});
router.get('/getprofile',async(req,res) => {

})

router.put('/profUpdate', upload.single("file"), async(req, res) => {
    console.log(req.file)
    if(!req.body.email) {
        return res.status(400).send('Email is required');
    }
    const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'orgUploads',
      });
        const updateData=
        {
            orgname: req.body.name,
            org_email: req.body.email,
            Year:req.body.establishedYear,
            desc: req.body.description,
            Industry:req.body.industry,
            locn:req.body.location,
            phno:req.body.phone,
            Services:req.body.services,
            profImg: result.secure_url,
        };
        
        try {
            const updatedOrg = await OrgDB.findOneAndUpdate(
              { org_email: req.body.email }, // Find by email
              updateData,
              { new: true, runValidators: true } // Return the updated document
            );

        
            if (!updatedOrg) {
              return res.status(404).send('Organization not found');
            }
            fs.unlinkSync(req.file.path);
            res.send(updatedOrg);
          } catch (error) {
            console.log( error);
            res.status(400).send(error.message);
          }
})

router.post("/addJobs",async(req,res)=>{
    const companyId = req.body._id; // Assuming _id refers to the company ID
    const jobDetails = req.body.newJob; // Assuming newJob contains the job data

    try {
        // Check if the same position already exists for the company
        const existingJob = await AddJob.findOne({
            company: companyId,
            position: jobDetails.position,
        });

        if (existingJob) {
            return res.status(409).json({ success: false, message: "Job position already exists for this company." });
        }

        // Create a new job object
        const newJob = {
            company: companyId,
            position: jobDetails.position,
            location: jobDetails.location,
            jobType: jobDetails.jobType,
            jobPosted: new Date(),
            jobDeadline: jobDetails.jobDeadline, // Ensure this is a valid Date
            vacancy: jobDetails.vacancy,
            requiredSkills: jobDetails.requiredSkills,
            salary: jobDetails.salary,
            jobDescription: jobDetails.jobDescription,
            jobFacilities: jobDetails.jobFacilities,
            IsOpened: true,
        };

        // Insert the new job into the database
        const job = await AddJob.create(newJob);
        console.log("Job inserted:", job);

        // Send a success response
        return res.status(201).json({ success: true, job }); // Use return here
    } catch (error) {
        console.error("Error inserting job:", error);
        // Send an error response
        return res.status(500).json({ success: false, message: "Error inserting job" }); // Use return here
    }
});
//fetching jobs
router.post('/managejob',async(req,res)=>{
    try {
        
        const { id } = req.body; // Use req.query to get the company ID from the query string
        
        // Validate that the ID is provided
        if (!id) {
            return res.status(400).json({ success: false, message: "Company ID is required." });
        }

        const jobs = await AddJob.find({ company: id });

        // Check if jobs were found
        if (jobs.length === 0) {
            return res.status(404).json({ success: false, message: "No jobs found for this company." });
        }

        // Send the retrieved jobs as a response
        res.status(200).json({ jobs });
    } catch (error) {
        console.error("Error while fetching jobs:", error);
        res.status(500).json({ success: false, message: "Error while fetching jobs." });
    }
});
//joblist
router.get('/joblist',async(req,res)=>{
    try{
        const joblist = await AddJob.find({})
        res.status(200).json({joblist})
    }
    catch(error){
        console.log(error)
    }
})

module.exports = router;