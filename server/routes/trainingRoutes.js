const express = require("express");
const Training = require("../models/Training");
const Student = require("../models/Student");
const Alumni = require("../models/Alumni");

const router = express.Router();

// POST /api/training/create
router.post("/create", async (req, res) => {
    try {
        const { studentId, skill, minCoins, maxCoins } = req.body;
        const training = new Training({
            student: studentId,
            skill,
            minCoins,
            maxCoins,
        });
        await training.save();
        res.status(201).json({ message: "Training request created", training });
    } catch (err) {
        res.status(500).json({ message: "Server error creating training" });
    }
});

// GET /api/training/all
router.get("/all", async (req, res) => {
    try {
        const trainings = await Training.find()
            .populate("student", "name rollNumber")
            .populate("alumni", "name")
            .sort({ createdAt: -1 });
        res.json(trainings);
    } catch (err) {
        res.status(500).json({ message: "Server error fetching trainings" });
    }
});

// POST /api/training/accept
router.post("/accept", async (req, res) => {
    try {
        const { trainingId, alumniId } = req.body;
        const training = await Training.findByIdAndUpdate(
            trainingId,
            { alumni: alumniId, status: "accepted" },
            { new: true }
        );
        res.json({ message: "Training request accepted", training });
    } catch (err) {
        res.status(500).json({ message: "Server error accepting training" });
    }
});

// POST /api/training/feedback
router.post("/feedback", async (req, res) => {
    try {
        const { trainingId, feedback } = req.body; // feedback: 'satisfied' or 'dissatisfied'
        const training = await Training.findById(trainingId);
        if (!training) return res.status(404).json({ message: "Training not found" });

        training.status = feedback;
        await training.save();

        const transferAmount = feedback === "satisfied" ? training.maxCoins : training.minCoins;

        // Transfer coins
        await Student.findByIdAndUpdate(training.student, { $inc: { coins: -transferAmount } });
        await Alumni.findByIdAndUpdate(training.alumni, { $inc: { coins: transferAmount } });

        res.json({ message: `Feedback submitted. ${transferAmount} coins allocated.`, training });
    } catch (err) {
        res.status(500).json({ message: "Server error submitting feedback" });
    }
});

module.exports = router;
