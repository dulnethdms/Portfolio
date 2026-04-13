const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    category: { type: String, enum: ["ai", "web", "data"], default: "ai" },
    techStack: [String],
    githubUrl: String,
    liveUrl: String,
    imageUrl: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Project", projectSchema);