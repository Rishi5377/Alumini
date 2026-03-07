const express = require("express");
const Request = require("../models/Request");
const Student = require("../models/Student");
const Alumni = require("../models/Alumni");

const router = express.Router();

// POST /api/requests/send
router.post("/send", async (req, res) => {
    try {
        const { senderId, senderModel, recipientId, recipientModel, message } = req.body;

        // Check if a request already exists
        const existing = await Request.findOne({
            sender: senderId,
            recipient: recipientId,
            status: "pending",
        });

        if (existing) {
            return res.status(400).json({ message: "Request already pending" });
        }

        const newRequest = new Request({
            sender: senderId,
            senderModel,
            recipient: recipientId,
            recipientModel,
            message,
        });

        await newRequest.save();
        res.status(201).json({ message: "Request sent successfully", request: newRequest });
    } catch (err) {
        console.error("Send request error:", err);
        res.status(500).json({ message: "Server error sending request" });
    }
});

// GET /api/requests/user/:userId
router.get("/user/:userId", async (req, res) => {
    try {
        const { userId } = req.params;
        const requests = await Request.find({
            $or: [{ sender: userId }, { recipient: userId }],
        })
            .populate("sender", "name rollNumber jobDescription about skills presentYear passedYear linkedinUrl githubUrl phoneNumber resume")
            .populate("recipient", "name rollNumber jobDescription about skills presentYear passedYear linkedinUrl githubUrl phoneNumber resume")
            .sort({ createdAt: -1 });

        res.json(requests);
    } catch (err) {
        console.error("Fetch requests error:", err);
        res.status(500).json({ message: "Server error fetching requests" });
    }
});

// POST /api/requests/action
router.post("/action", async (req, res) => {
    try {
        const { requestId, action } = req.body; // action: 'accepted' or 'rejected'

        if (!["accepted", "rejected"].includes(action)) {
            return res.status(400).json({ message: "Invalid action" });
        }

        const request = await Request.findById(requestId);
        if (!request) {
            return res.status(404).json({ message: "Request not found" });
        }

        request.status = action;
        await request.save();

        res.json({ message: `Request ${action}`, request });
    } catch (err) {
        console.error("Request action error:", err);
        res.status(500).json({ message: "Server error updating request" });
    }
});

// POST /api/requests/remove-mentor
router.post("/remove-mentor", async (req, res) => {
    try {
        const { requestId, reason } = req.body;
        const request = await Request.findById(requestId);
        if (!request) {
            return res.status(404).json({ message: "Request not found" });
        }

        request.status = "rejected"; // Or a new status like 'removed'
        request.removalReason = reason;
        await request.save();

        res.json({ message: "Mentor removed successfully", request });
    } catch (err) {
        console.error("Remove mentor error:", err);
        res.status(500).json({ message: "Server error removing mentor" });
    }
});

module.exports = router;
