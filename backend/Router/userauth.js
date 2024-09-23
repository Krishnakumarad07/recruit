const express = require('express');
const router = express.Router();
const UserDB = require('../Models/UserModel');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const nodemailer= require("nodemailer");

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'fallbackkey';

// Route to handle user registration (sign-up)
router.post('/signup', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Check if the user already exists
        const existingUser = await UserDB.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create a new user
        const newUser = new UserDB({
            username,
            email,
            password,  // Store the plain text password
        });
        const user = await newUser.save();

        // Generate a JWT token
        const token = jwt.sign(
            { id: user._id, username: user.username, email: user.email },
            JWT_SECRET,
        );

        res.json({
            message: 'User created successfully',
            token,
        });
    } catch (err) {
        res.status(500).json(err);
    }
});

// Route to handle user login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find the user by email
        const user = await UserDB.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Check if the password matches
        if (user.password !== password) {  // Compare plain text passwords
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate a JWT token
        const token = jwt.sign(
            { id: user._id, username: user.username, email: user.email },
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
        const user = await UserDB.findOne({ email });
        if (!user) {
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
            to: user.email,
            subject: 'Regarding Forgot Password',
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


module.exports = router;