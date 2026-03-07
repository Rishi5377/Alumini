const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
    {
        postedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Alumni",
            required: true,
        },
        company: { type: String, required: true, trim: true },
        role: { type: String, required: true, trim: true },
        description: { type: String, required: true },
        link: { type: String, required: true },
        referralEmail: { type: String, required: true },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Job", jobSchema);
