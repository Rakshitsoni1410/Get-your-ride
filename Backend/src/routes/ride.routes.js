const express = require("express");
const router = express.Router();
const rideController = require("../controllers/ride.controller");
const authMiddleware = require("../middleware/auth.middleware");

router.post("/create", authMiddleware.authUser, rideController.createRide);

module.exports = router;