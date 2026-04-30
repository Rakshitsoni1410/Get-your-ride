const Ride = require("../models/ride.model");

// 🚗 CREATE RIDE
exports.createRide = async (req, res) => {
  try {
    const { pickup, destination } = req.body;

    if (!pickup || !destination) {
      return res.status(400).json({ message: "Pickup & destination required" });
    }

    const fare = Math.floor(Math.random() * 500) + 50;

    const ride = await Ride.create({
      user: req.user.id,
      pickup,
      destination,
      fare
    });

    // 🔥 IMPORTANT FIX — SEND TO ALL CAPTAINS
    global.io.to("captains").emit("new-ride", ride);

    res.status(201).json({ ride });

  } catch (err) {
    console.error("CREATE RIDE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};
// accept ride 
exports.acceptRide = async (req, res) => {
  try {
    const ride = await Ride.findById(req.body.rideId);

    ride.captain = req.user.id;
    ride.status = "accepted";
    await ride.save();

    // 🔥 Notify USER
    global.io.to(ride.user.toString()).emit("ride-accepted", ride);

    res.json({ ride });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};