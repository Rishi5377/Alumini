const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const Alumni = require("../models/Alumni");

const router = express.Router();


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "..", "uploads"));
    },
    filename: (req, file, cb) => {
        const uniqueName = `alumni_${Date.now()}_${file.originalname}`;
        cb(null, uniqueName);
    },
});
const upload = multer({ storage });

// POST /api/alumni/register
router.post("/register", upload.single("resume"), async (req, res) => {
    try {
        const {
            name,
            rollNumber,
            passedYear,
            linkedinUrl,
            githubUrl,
            phoneNumber,
            password,
            about,
            jobDescription,
            experience,
            skills,
        } = req.body;

        // Check if alumni already exists
        const existing = await Alumni.findOne({ rollNumber });
        if (existing) {
            return res.status(400).json({ message: "Alumni with this roll number already exists" });
        }

        // Hash password
        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Parse skills
        const parsedSkills = skills
            ? skills.split(",").map((s) => s.trim()).filter(Boolean)
            : [];

        const alumni = new Alumni({
            name,
            rollNumber,
            passedYear,
            linkedinUrl: linkedinUrl || "",
            githubUrl: githubUrl || "",
            phoneNumber: phoneNumber || "",
            password: hashedPassword,
            about: about || "",
            jobDescription: jobDescription || "",
            experience: experience || "",
            skills: parsedSkills,
            resume: req.file ? req.file.filename : "",
        });

        await alumni.save();

        const token = jwt.sign(
            { id: alumni._id, role: "alumni" },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.status(201).json({
            message: "Alumni registered successfully",
            token,
            user: {
                id: alumni._id,
                name: alumni.name,
                rollNumber: alumni.rollNumber,
                role: "alumni",
            },
        });
    } catch (err) {
        console.error("Alumni registration error:", err);
        res.status(500).json({ message: "Server error during registration" });
    }
});

// POST /api/alumni/login
router.post("/login", async (req, res) => {
    try {
        const { rollNumber, password } = req.body;

        const alumni = await Alumni.findOne({ rollNumber });
        if (!alumni) {
            return res.status(400).json({ message: "Invalid roll number or password" });
        }

        const isMatch = await bcrypt.compare(password, alumni.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid roll number or password" });
        }

        const token = jwt.sign(
            { id: alumni._id, role: "alumni" },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.json({
            message: "Login successful",
            token,
            user: {
                id: alumni._id,
                name: alumni.name,
                rollNumber: alumni.rollNumber,
                role: "alumni",
            },
        });
    } catch (err) {
        console.error("Alumni login error:", err);
        res.status(500).json({ message: "Server error during login" });
    }
});

// GET /api/alumni/search
router.get("/search", async (req, res) => {
    try {
        const { company, skills, experience } = req.query;
        let query = {};

        if (company) {
            query.jobDescription = { $regex: company, $options: "i" };
        }
        if (skills) {
            const skillArray = skills.split(",").map((s) => s.trim());
            query.skills = { $in: skillArray };
        }
        if (experience) {
            query.experience = { $regex: experience, $options: "i" };
        }

        const alumni = await Alumni.find(query).select("-password");
        res.json(alumni);
    } catch (err) {
        console.error("Alumni search error:", err);
        res.status(500).json({ message: "Server error during search" });
    }
});

// GET /api/alumni/all
router.get("/all", async (req, res) => {
    try {
        const alumni = await Alumni.find().select("-password");
        res.json(alumni);
    } catch (err) {
        console.error("Fetch alumni error:", err);
        res.status(500).json({ message: "Server error fetching alumni" });
    }
});

// GET /api/alumni/leaderboard
router.get("/leaderboard", async (req, res) => {
    try {
        const topAlumni = await Alumni.find()
            .sort({ coins: -1 })
            .limit(100)
            .select("name rollNumber jobDescription coins skills");
        res.json(topAlumni);
    } catch (err) {
        console.error("Leaderboard error:", err);
        res.status(500).json({ message: "Server error fetching leaderboard" });
    }
});

// POST /api/alumni/give-coins
router.post("/give-coins", async (req, res) => {
    try {
        const { alumniId, amount } = req.body;
        await Alumni.findByIdAndUpdate(alumniId, { $inc: { coins: amount } });
        res.json({ message: `Successfully gave ${amount} coins!` });
    } catch (err) {
        console.error("Give coins error:", err);
        res.status(500).json({ message: "Server error giving coins" });
    }
});

module.exports = router;
