const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth.controller");

// ✅ MUST be functions
router.post("/login", authController.login);

module.exports = router;