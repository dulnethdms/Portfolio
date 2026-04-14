const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { protect } = require("../middleware/authmiddleware");
const {
  getPhotos,
  createPhoto,
  deletePhoto,
} = require("../controllers/photoController");

const router = express.Router();
const uploadDir = path.join(__dirname, "..", "uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, uploadDir);
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

router.get("/", getPhotos);
router.post("/", protect, upload.single("image"), createPhoto);
router.delete("/:id", protect, deletePhoto);

module.exports = router;
