const mongoose = require("mongoose");

const blogPostSchema = new mongoose.Schema(
  {
    title: String,
    content: String,
    tags: [String],
  },
  { timestamps: true }
);

module.exports = mongoose.model("BlogPost", blogPostSchema);