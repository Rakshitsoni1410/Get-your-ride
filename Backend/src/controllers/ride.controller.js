const Ride = require("../models/ride.model");

// 🚗 CREATE RIDE
exports.createRide = async (req, res) => {
  try {
    const { pickup, destination, pickupCoords, destinationCoords, vehicleType, distance, fare } = req.body;

    if (!pickup || !destination) {
      return res.status(400).json({ message: "Pickup & destination required" });
    }

    const ride = await Ride.create({
      user: req.user.id,
      pickup,
      destination,
      pickupCoords: pickupCoords || {},
      destinationCoords: destinationCoords || {},
      vehicleType: vehicleType || "car",
      distance: distance || 0,
      fare: fare || Math.floor(Math.random() * 300) + 80,
    });

    // Notify all online captains
    global.io.to("captains").emit("new-ride", ride);

    res.status(201).json({ ride });
  } catch (err) {
    console.error("CREATE RIDE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

// ✅ ACCEPT RIDE
exports.acceptRide = async (req, res) => {
  try {
    const ride = await Ride.findById(req.body.rideId);
    if (!ride) return res.status(404).json({ message: "Ride not found" });
    if (ride.status !== "requested") return res.status(400).json({ message: "Ride already accepted" });

    ride.captain = req.user.id;
    ride.status = "accepted";
    await ride.save();

    // Notify the user
    global.io.to(ride.user.toString()).emit("ride-accepted", {
      ...ride.toObject(),
      rideId: ride._id,
    });

    res.json({ ride });
  } catch (err) {
    console.error("ACCEPT RIDE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

// 🏁 COMPLETE RIDE
exports.completeRide = async (req, res) => {
  try {
    const ride = await Ride.findById(req.body.rideId);
    if (!ride) return res.status(404).json({ message: "Ride not found" });

    ride.status = "completed";
    await ride.save();

    global.io.to(ride.user.toString()).emit("ride-completed", { rideId: ride._id });

    res.json({ ride });
  } catch (err) {
    console.error("COMPLETE RIDE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

// 📜 RIDE HISTORY
exports.getRideHistory = async (req, res) => {
  try {
    const rides = await Ride.find({ user: req.user.id }).sort({ createdAt: -1 }).limit(20);
    res.json({ rides });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
