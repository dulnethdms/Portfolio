const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { protect } = require("../middleware/authmiddleware");
const {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
} = require("../controllers/projectController");

const uploadDir = path.join(__dirname, "..", "uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Local storage (you can swap to Cloudinary later)
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, uploadDir);
  },
  filename(req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

router.get("/", getProjects);
router.get("/:id", getProjectById);
router.post("/", protect, upload.single("image"), createProject);
router.put("/:id", protect, upload.single("image"), updateProject);
router.delete("/:id", protect, deleteProject);

module.exports = router;