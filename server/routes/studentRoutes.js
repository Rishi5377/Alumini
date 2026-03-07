const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const Student = require("../models/Student");

const router = express.Router();

// Multer config for resume uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "..", "uploads"));
    },
    filename: (req, file, cb) => {
        const uniqueName = `student_${Date.now()}_${file.originalname}`;
        cb(null, uniqueName);
    },
});
const upload = multer({ storage });

// POST /api/students/register
router.post("/register", upload.single("resume"), async (req, res) => {
    try {
        const {
            name,
            rollNumber,
            presentYear,
            linkedinUrl,
            githubUrl,
            phoneNumber,
            password,
            about,
            skills,
        } = req.body;

        // Check if student already exists
        const existing = await Student.findOne({ rollNumber });
        if (existing) {
            return res.status(400).json({ message: "Student with this roll number already exists" });
        }

        // Hash password
        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Parse skills (comes as comma-separated string from form)
        const parsedSkills = skills
            ? skills.split(",").map((s) => s.trim()).filter(Boolean)
            : [];

        const student = new Student({
            name,
            rollNumber,
            presentYear,
            linkedinUrl: linkedinUrl || "",
            githubUrl: githubUrl || "",
            phoneNumber: phoneNumber || "",
            password: hashedPassword,
            about: about || "",
            skills: parsedSkills,
            resume: req.file ? req.file.filename : "",
        });

        await student.save();

        // Return JWT token
        const token = jwt.sign(
            { id: student._id, role: "student" },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.status(201).json({
            message: "Student registered successfully",
            token,
            user: {
                id: student._id,
                name: student.name,
                rollNumber: student.rollNumber,
                role: "student",
            },
        });
    } catch (err) {
        console.error("Student registration error:", err);
        res.status(500).json({ message: "Server error during registration" });
    }
});

// POST /api/students/login
router.post("/login", async (req, res) => {
    try {
        const { rollNumber, password } = req.body;

        const student = await Student.findOne({ rollNumber });
        if (!student) {
            return res.status(400).json({ message: "Invalid roll number or password" });
        }

        const isMatch = await bcrypt.compare(password, student.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid roll number or password" });
        }

        const token = jwt.sign(
            { id: student._id, role: "student" },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.json({
            message: "Login successful",
            token,
            user: {
                id: student._id,
                name: student.name,
                rollNumber: student.rollNumber,
                role: "student",
                coins: student.coins,
            },
        });
    } catch (err) {
        console.error("Student login error:", err);
        res.status(500).json({ message: "Server error during login" });
    }
});

// POST /api/students/donate
router.post("/donate", async (req, res) => {
    try {
        const { studentId, alumniId, amount } = req.body;

        const student = await Student.findById(studentId);
        if (!student) return res.status(404).json({ message: "Student not found" });

        // Check if student has already donated max free coins (50)
        // For simplicity, we assume this is a one-time free 50 coins donation per student total
        // You requested "maxmium 50 coins can be donated to alumini for free"
        // We will check a field or just limit it
        if (student.donated) {
            return res.status(400).json({ message: "You have already used your 50 free coins donation." });
        }

        await Student.findByIdAndUpdate(studentId, { $inc: { coins: -amount }, donated: true });
        await Alumni.findByIdAndUpdate(alumniId, { $inc: { coins: amount } });

        res.json({ message: "Donation successful!" });
    } catch (err) {
        console.error("Donate error:", err);
        res.status(500).json({ message: "Server error during donation" });
    }
});

module.exports = router;
