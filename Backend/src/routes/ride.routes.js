const express = require("express");
const router = express.Router();

const rideController = require("../controllers/ride.controller");
const authMiddleware = require("../middleware/auth.middleware");


// 🚗 CREATE RIDE ROUTE
router.post("/create", authMiddleware.authUser, rideController.createRide);

module.exports = router;