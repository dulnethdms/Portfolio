const express = require("express");
const router = express.Router();
const { login, seedAdmin } = require("../controllers/authController");

router.post("/login", login);

// Optional: one-time admin seed route (protect with env flag or remove in production)
if (process.env.ALLOW_SEED === "true") {
  router.post("/seed-admin", seedAdmin);
}

module.exports = router;