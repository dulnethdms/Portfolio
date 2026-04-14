const express = require("express");
const router = express.Router();
const { login, seedAdmin, updateAdmin } = require("../controllers/authController");
const { protect } = require("../middleware/authmiddleware");

router.post("/login", login);
router.put("/admin", protect, updateAdmin);

// Optional: one-time admin seed route (protect with env flag or remove in production)
if (process.env.ALLOW_SEED === "true") {
  router.post("/seed-admin", seedAdmin);
}

module.exports = router;