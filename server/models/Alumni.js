const mongoose = require("mongoose");

const alumniSchema = new mongoose.Schema(
    {
        // Phase 1
        name: { type: String, required: true, trim: true },
        rollNumber: { type: String, required: true, unique: true, trim: true },
        passedYear: { type: String, required: true, trim: true },
        linkedinUrl: { type: String, default: "" },
        githubUrl: { type: String, default: "" },
        phoneNumber: { type: String, default: "" },
        password: { type: String, required: true },

        // Phase 2
        about: { type: String, default: "" },
        jobDescription: { type: String, default: "" },
        experience: { type: String, default: "" },
        skills: { type: [String], default: [] },

        // Phase 3
        coins: { type: Number, default: 0 },
        resume: { type: String, default: "" }, // file path
    },
    { timestamps: true }
);

module.exports = mongoose.model("Alumni", alumniSchema);
