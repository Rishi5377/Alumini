const express = require("express");
const Job = require("../models/Job");
const Alumni = require("../models/Alumni");
const Request = require("../models/Request");

const router = express.Router();

// POST /api/jobs/add
router.post("/add", async (req, res) => {
    try {
        const { postedBy, company, role, description, link, referralEmail } = req.body;

        const newJob = new Job({
            postedBy,
            company,
            role,
            description,
            link,
            referralEmail,
        });

        await newJob.save();

        // Add 100 coins to the alumni who posted
        await Alumni.findByIdAndUpdate(postedBy, { $inc: { coins: 100 } });

        res.status(201).json({ message: "Job posted successfully! +100 coins earned.", job: newJob });
    } catch (err) {
        console.error("Add job error:", err);
        res.status(500).json({ message: "Server error adding job" });
    }
});

// GET /api/jobs/all
router.get("/all", async (req, res) => {
    try {
        // We will populate poster name for the UI
        const jobs = await Job.find()
            .populate("postedBy", "name")
            .sort({ createdAt: -1 });

        res.json(jobs);
    } catch (err) {
        console.error("Fetch jobs error:", err);
        res.status(500).json({ message: "Server error fetching jobs" });
    }
});

module.exports = router;
