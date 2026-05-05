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

  pickupCoords: {
    lat: Number,
    lng: Number
  },
  destinationCoords: {
    lat: Number,
    lng: Number
  },

  vehicleType: String,
  distance: Number,
  fare: Number,

  status: {
    type: String,
    enum: ["requested", "accepted", "started", "completed"],
    default: "requested"
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Ride", rideSchema);