const express = require('express');
const router = express.Router();
const UserDB=require("../Models/UserModel")
const OrgDB=require("../Models/Orgmodel")
const JobsDB=require("../Models/OrgJobs")
const nodemailer = require("nodemailer")
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAILID,
      pass: process.env.MAILPWD,
    },
  });
router.get("/allcount",async(req, res) => {
    try {
        const UserCount = await UserDB.countDocuments() || 0;
        const OrgCount = await OrgDB.countDocuments() || 0;
        const JobCount = await JobsDB.countDocuments() || 0;

        return res.status(200).json({
            UserCount,
            OrgCount,
            JobCount
        });
    } catch (error) {
        console.error(error); // Log the error for debugging
        return res.status(500).json({ message: "Data can't be fetched", error: error.message });
    }
})
router.get('/UserDetails',async(req,res)=>{
    try {
        const UserDetails=await UserDB.find()||"";
        return res.status(200).json({UserDetails});
    }
    catch (error) {
        console.error(error); // Log the error for debugging
        return res.status(500).json({ message: "Data can't be fetched", error: error.message });
    }
})
router.get('/orgDetails',async(req,res)=>{
    try {
        const orgDetails=await OrgDB.find()||"";
        return res.status(200).json({orgDetails});
    }
    catch (error) {
        console.error(error); // Log the error for debugging
        return res.status(500).json({ message: "Data can't be fetched", error: error.message });
    }
})
router.get('/JobDetails',async(req,res)=>{
    try {
        const JobDetails=await JobsDB.find({}).populate('company','orgname _id org_email')||'';
        return res.status(200).json({JobDetails});
    }
    catch (error) {
        console.error(error); // Log the error for debugging
        return res.status(500).json({ message: "Data can't be fetched", error: error.message });
    }
});

router.delete('/UserDetailsDelete/:id', async (req, res) => {
    
    try {
        console.log(req.params.id);
      const user = await UserDB.findByIdAndDelete(req.params.id);
    //   console.log(user);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      console.log(user.email);
  
      // Send removal email
      const mailOptions = {
        from: `"Smart Recruiter" <${process.env.MAILID}>`,
        to: user.email,
        subject: 'Account Removal Notification',
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
              <p>Best regards,<br>Smart Recruiter Team</p>
            </div>
          </div>
        </body>
        </html>`,
      };
  
      // Send the email
      await transporter.sendMail(mailOptions);
      console.log("User removed successfully and email sent.");
      return res.status(200).json({ message: 'User removed successfully and email sent.' });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  });
  
module.exports = router;