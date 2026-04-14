const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authmiddleware");
const { getSiteSettings, updateSiteSettings } = require("../controllers/siteSettingsController");

router.get("/", getSiteSettings);
router.put("/", protect, updateSiteSettings);

module.exports = router;
