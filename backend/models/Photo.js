const mongoose = require("mongoose");

const photoSchema = new mongoose.Schema(
  {
    caption: { type: String, trim: true, default: "" },
    imageUrl: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Photo", photoSchema);
