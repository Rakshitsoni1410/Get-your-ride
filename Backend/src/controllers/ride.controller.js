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
      user: req.user.id,   // from JWT
      pickup,
      destination,
      fare
    });

    res.status(201).json({ ride });

  } catch (err) {
    console.error("CREATE RIDE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};