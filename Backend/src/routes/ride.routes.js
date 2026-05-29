const express = require("express");
const router = express.Router();
const rideController = require("../controllers/ride.controller");
const authMiddleware = require("../middleware/auth.middleware");

router.post("/create", authMiddleware.authUser, rideController.createRide);
router.post("/accept", authMiddleware.authCaptain, rideController.acceptRide);
router.post("/complete", authMiddleware.authCaptain, rideController.completeRide);
router.get("/history", authMiddleware.authUser, rideController.getRideHistory);

module.exports = router;
