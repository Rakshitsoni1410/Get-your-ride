const express = require("express");
const router = express.Router();

const User = require("../models/user.model");
const userController = require("../controllers/user.controller");

// ✅ ADD THIS LINE
const authMiddleware = require("../middleware/auth.middleware");

// AUTH ROUTES
router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);

// ✅ GET USER PROFILE
router.get("/me", authMiddleware.authUser, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;