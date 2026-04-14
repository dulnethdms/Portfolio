const fs = require("fs");
const path = require("path");
const Photo = require("../models/Photo");

function removeUploadedFile(imageUrl) {
  if (!imageUrl || typeof imageUrl !== "string") return;

  const filename = path.basename(imageUrl);
  const fullPath = path.join(__dirname, "..", "uploads", filename);

  fs.unlink(fullPath, (err) => {
    if (err && err.code !== "ENOENT") {
      console.error("Failed to remove uploaded file:", err.message);
    }
  });
}

exports.getPhotos = async (req, res) => {
  try {
    const photos = await Photo.find().sort({ createdAt: -1 });
    res.json(photos);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch photos" });
  }
};

exports.createPhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Image file is required" });
    }

    const caption = (req.body.caption || "").trim();
    const imageUrl = `/uploads/${req.file.filename}`;

    const photo = await Photo.create({ caption, imageUrl });
    res.status(201).json(photo);
  } catch (err) {
    res.status(500).json({ message: "Failed to upload photo" });
  }
};

exports.deletePhoto = async (req, res) => {
  try {
    const photo = await Photo.findByIdAndDelete(req.params.id);
    if (!photo) {
      return res.status(404).json({ message: "Photo not found" });
    }

    removeUploadedFile(photo.imageUrl);
    res.json({ message: "Photo deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete photo" });
  }
};
