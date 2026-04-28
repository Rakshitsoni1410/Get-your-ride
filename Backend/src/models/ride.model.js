const mongoose = require("mongoose");

const rideSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  captain: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Captain",
    default: null
  },
  pickup: String,
  destination: String,
  fare: Number,
  status: {
    type: String,
    enum: ["requested", "accepted", "started", "completed", "cancelled"],
    default: "requested"
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Ride", rideSchema);