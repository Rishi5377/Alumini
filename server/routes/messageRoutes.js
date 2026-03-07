const express = require("express");
const Message = require("../models/Message");

const router = express.Router();

// POST /api/messages/send
router.post("/send", async (req, res) => {
    try {
        const { senderId, senderModel, recipientId, recipientModel, text } = req.body;

        const newMessage = new Message({
            sender: senderId,
            senderModel,
            recipient: recipientId,
            recipientModel,
            text,
        });

        await newMessage.save();
        res.status(201).json(newMessage);
    } catch (err) {
        console.error("Send message error:", err);
        res.status(500).json({ message: "Server error sending message" });
    }
});

// GET /api/messages/:userId1/:userId2
router.get("/:userId1/:userId2", async (req, res) => {
    try {
        const { userId1, userId2 } = req.params;
        const messages = await Message.find({
            $or: [
                { sender: userId1, recipient: userId2 },
                { sender: userId2, recipient: userId1 },
            ],
        }).sort({ createdAt: 1 });

        res.json(messages);
    } catch (err) {
        console.error("Fetch messages error:", err);
        res.status(500).json({ message: "Server error fetching messages" });
    }
});

module.exports = router;
