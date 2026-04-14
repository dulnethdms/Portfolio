const fs = require("fs");
const path = require("path");
const Cv = require("../models/Cv");

function removeUploadedFile(fileUrl) {
  if (!fileUrl || typeof fileUrl !== "string") return;

  const filename = path.basename(fileUrl);
  const fullPath = path.join(__dirname, "..", "uploads", filename);

  fs.unlink(fullPath, (err) => {
    if (err && err.code !== "ENOENT") {
      console.error("Failed to remove cv file:", err.message);
    }
  });
}

exports.getCurrentCv = async (req, res) => {
  try {
    const cv = await Cv.findOne().sort({ createdAt: -1 });
    res.json(cv || null);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch CV" });
  }
};

exports.uploadCv = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "CV file is required" });
    }

    const previousCv = await Cv.findOne().sort({ createdAt: -1 });

    const cv = await Cv.create({
      originalName: req.file.originalname,
      fileUrl: `/uploads/${req.file.filename}`,
      mimeType: req.file.mimetype || "",
      size: req.file.size || 0,
    });

    if (previousCv) {
      await Cv.deleteOne({ _id: previousCv._id });
      removeUploadedFile(previousCv.fileUrl);
    }

    res.status(201).json(cv);
  } catch (err) {
    res.status(500).json({ message: "Failed to upload CV" });
  }
};

exports.deleteCv = async (req, res) => {
  try {
    const cv = await Cv.findByIdAndDelete(req.params.id);
    if (!cv) {
      return res.status(404).json({ message: "CV not found" });
    }

    removeUploadedFile(cv.fileUrl);
    res.json({ message: "CV deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete CV" });
  }
};
