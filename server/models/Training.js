const mongoose = require("mongoose");

const trainingSchema = new mongoose.Schema(
    {
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Student",
            required: true,
        },
        alumni: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Alumni",
        },
        skill: {
            type: String,
            required: true,
        },
        minCoins: {
            type: Number,
            required: true,
        },
        maxCoins: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            enum: ["pending", "accepted", "satisfied", "dissatisfied"],
            default: "pending",
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Training", trainingSchema);
