const express = require("express");
const router = express.Router();
const Captain = require("../models/captain.model");

// ✅ ADD THIS LINE
const authMiddleware = require("../middleware/auth.middleware");

// 👇 EXISTING ROUTES
const captainController = require("../controllers/captain.controller");

router.post("/register", captainController.registerCaptain);
router.post("/login", captainController.loginCaptain);

// ✅ NEW PROFILE ROUTE
router.get("/me", authMiddleware.authCaptain, async (req, res) => {
  try {
    const captain = await Captain.findById(req.user.id);
    res.json({ captain });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;