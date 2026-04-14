const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { protect } = require("../middleware/authmiddleware");
const { getCurrentCv, uploadCv, deleteCv } = require("../controllers/cvController");

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

const allowedExtensions = /\.(pdf|doc|docx)$/i;
const allowedMimeTypes = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/octet-stream",
]);

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter(req, file, cb) {
    const validExt = allowedExtensions.test(file.originalname || "");
    const validMime = !file.mimetype || allowedMimeTypes.has(file.mimetype);

    if (!validExt || !validMime) {
      const err = new Error("Only PDF, DOC, or DOCX files are allowed");
      err.statusCode = 400;
      return cb(err);
    }

    cb(null, true);
  },
});

router.get("/", getCurrentCv);
router.post("/", protect, upload.single("cv"), uploadCv);
router.delete("/:id", protect, deleteCv);

module.exports = router;
