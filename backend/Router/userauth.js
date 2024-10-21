const express = require("express");
const router = express.Router();
const UserDB = require("../Models/UserModel");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const nodemailer = require("nodemailer");
const multer = require("multer");
const cloudinary = require("../Models/cloudinary");
const fs = require("fs");
const path = require("path");

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "fallbackkey";
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./orgUploads"); // Directory where files will be saved
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Rename file to avoid conflicts
  },
});
const upload = multer({ storage });

// Route to handle user registration (sign-up)
router.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if the user already exists
    const existingUser = await UserDB.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create a new user
    const newUser = new UserDB({
      username,
      email,
      password, // Store the plain text password
    });
    const user = await newUser.save();
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAILID,
        pass: process.env.MAILPWD,
      },
    });

    // Configure the email options
    const mailOptions = {
      from: `"Recruit" <${process.env.MAILID}>`,
      to: user.email,
      subject: "Welcome to Recruit-Job Site!",
      text: `Hello ${user.username},\n\nThank you for registering on the Recruit Official job site! We’re excited to have you on board.\n\nBest regards,\nRecruit's Team`, // Plain text
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
            <h2>Hello ${user.username},</h2>
            <p>Thank you for registering on the Recruit's Official job site! We’re excited to have you on board.</p>
            <p>If you have any questions, feel free to reach out to our support team.</p>
            <div class="footer">
              <p>Best regards,<br>Recruit's Team</p>
            </div>
          </div>
        </body>
        </html>
        `,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    // Generate a JWT token
    const token = jwt.sign(
      { id: user._id, username: user.username, email: user.email },
      JWT_SECRET
    );

    return res.json({
      message: "User created successfully and mail sent successfully",
      token,
    });
  } catch (err) {
    return res.status(500).json(err);
  }
});

// Route to handle user login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await UserDB.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Check if the password matches
    if (user.password !== password) {
      // Compare plain text passwords
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
        email: user.email,
        age: user.age,
        phone: user.phone,
        location: user.location,
        Gender: user.Gender,
        experience: user.experience,
        description: user.description,
        skills: user.skills,
        image: user.image,
        // Add more fields as necessary
      },
      JWT_SECRET
    );

    return res.json({
      message: "Login successful",
      token,
    });
  } catch (err) {
    return res.status(500).json(err);
  }
});

router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  try {
    // Find the user by email
    const user = await UserDB.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "No such email in DB" });
    }

    // Configure Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAILID,
        pass: process.env.MAILPWD,
      },
    });

    // Configure the email options
    const mailOptions = {
      from: `"Recruit" <${process.env.MAILID}>`,
      to: user.email,
      subject: "Regarding Forgot Password",
      text: `Your password is: ${user.password}`, // Plain text
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
    <h2>Hello ${user.username},</h2>
    <p>We received a request to for your password. </p>
    <p><h5>Here is Your Password:<mark>${user.password}</mark></h5></p>
    <p>If you did not request this change, please ignore this email or contact support if you have questions.</p>
    <div class="footer">
      <p>Best regards,<br>Recruit's Team</p>
    </div>
  </div>
</body>
</html>
`,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    return res.status(200).json({ message: "Password sent to email" });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ message: "Error sending password", error: err });
  }
});
router.put("/profUpdate", upload.single("file"), async (req, res) => {
  if (!req.body.email) {
    return res.status(400).send("Email is required");
  }
  var updateData;
  var bool = false;
  if (req.file) {
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "orgUploads",
    });
    updateData = {
      username: req.body.name,
      age: req.body.age,
      email: req.body.email,
      phone: req.body.phone,
      description: req.body.description,
      location: req.body.location,
      Gender: req.body.Gender,
      experience: req.body.experience,
      skills: req.body.skills,
      image: result.secure_url,
    };
    bool = true;
  } else {
    updateData = {
      username: req.body.name,
      age: req.body.age,
      email: req.body.email,
      phone: req.body.phone,
      description: req.body.description,
      location: req.body.location,
      Gender: req.body.Gender,
      experience: req.body.experience,
      skills: req.body.skills,
    };
  }

  try {
    const updatedUser = await UserDB.findOneAndUpdate(
      { email: req.body.email }, // Find by email
      updateData,
      { new: true, runValidators: true } // Return the updated document
    );

    if (!updatedUser) {
      return res.status(404).send("Organization not found");
    }
    if (bool) {
      fs.unlinkSync(req.file.path);
    }
    return res.status(200).send(updatedUser);
  } catch (error) {
    console.log(error);
    return res.status(400).send(error.message);
  }
});

module.exports = router;
