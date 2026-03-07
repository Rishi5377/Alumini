const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
    {
        // Phase 1
        name: { type: String, required: true, trim: true },
        rollNumber: { type: String, required: true, unique: true, trim: true },
        presentYear: { type: String, required: true, trim: true },
        linkedinUrl: { type: String, default: "" },
        githubUrl: { type: String, default: "" },
        phoneNumber: { type: String, default: "" },
        password: { type: String, required: true },

        // Phase 2
        about: { type: String, default: "" },
        skills: { type: [String], default: [] },
        resume: { type: String, default: "" }, // file path

        // Phase 3
        coins: { type: Number, default: 500 },
        donated: { type: Boolean, default: false },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Student", studentSchema);
