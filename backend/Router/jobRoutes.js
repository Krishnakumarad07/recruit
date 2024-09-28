const express = require('express');
const router = express.Router();
const OrgDB = require('../Models/Orgmodel');
const cloudinary = require("../Models/cloudinary");
const multer = require("multer");
const fs = require("fs");
const AddJob = require("../Models/OrgJobs");
const Candidates = require("../Models/AppliedCandidate");
const ResumeScore = require("../ats");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './orgUploads'); // Directory where files will be saved
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`); // Rename file to avoid conflicts
    }
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

        // Save application to database
        const newApplication = new Candidates(applicationData);
        await newApplication.save();

        // Optionally delete the uploaded file after processing
        fs.unlink(req.file.path, (err) => {
            if (err) console.log('Error deleting file:', err);
        });

        return res.status(201).json({ message: "Application submitted successfully." });

    } catch (err) {
        console.log("Error occurred:", err);
        return res.status(500).json({ message: "An error occurred", error: err.message });
    }
});
router.delete("/deletejob/:id",async (req, res)=> {
    try {
        console.log(req.params);
        await AddJob.findByIdAndDelete(req.params.id);
        return res.status(200).json({ message: "deleted successfully" });
    }
    catch (err) {
        console.log(err);
        res.status(500).send({ message: 'Error deleting job', err });
    }
})

module.exports = router;
