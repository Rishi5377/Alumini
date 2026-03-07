const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema(
    {
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            refPath: "senderModel",
            required: true,
        },
        senderModel: {
            type: String,
            required: true,
            enum: ["Student", "Alumni"],
        },
        recipient: {
            type: mongoose.Schema.Types.ObjectId,
            refPath: "recipientModel",
            required: true,
        },
        recipientModel: {
            type: String,
            required: true,
            enum: ["Student", "Alumni"],
        },
        status: {
            type: String,
            enum: ["pending", "accepted", "rejected"],
            default: "pending",
        },
        message: {
            type: String,
            default: "",
        },
        removalReason: {
            type: String,
            default: "",
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Request", requestSchema);
