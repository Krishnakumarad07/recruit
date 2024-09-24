const express = require('express');
const router = express.Router();
const UserDB=require("../Models/UserModel")
const OrgDB=require("../Models/Orgmodel")
const JobsDB=require("../Models/OrgJobs")

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

module.exports = router;