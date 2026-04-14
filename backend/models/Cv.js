const mongoose = require("mongoose");

const cvSchema = new mongoose.Schema(
  {
    originalName: { type: String, required: true },
    fileUrl: { type: String, required: true },
    mimeType: { type: String, default: "" },
    size: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cv", cvSchema);
