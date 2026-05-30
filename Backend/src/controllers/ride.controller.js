const Ride = require("../models/ride.model");
const Captain = require("../models/captain.model");

// ─── DYNAMIC FARE CALCULATION ───────────────────────────────────────────────
function calcFare(vehicleType, distanceKm) {
  const rates = {
    car:  { base: 50, perKm: 14, perMin: 1.5 },
    bike: { base: 25, perKm:  7, perMin: 0.8 },
    auto: { base: 35, perKm: 10, perMin: 1.0 },
  };
  const r = rates[vehicleType] || rates.car;
  // Estimate ~3 min/km in city traffic
  const estMinutes = distanceKm * 3;
  const fare = Math.round(r.base + distanceKm * r.perKm + estMinutes * r.perMin);
  return Math.max(fare, r.base); // never below base
}

// ─── HAVERSINE DISTANCE (km) ────────────────────────────────────────────────
function haversineKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// ─── CREATE RIDE ─────────────────────────────────────────────────────────────
exports.createRide = async (req, res) => {
  try {
    const { pickup, destination, pickupCoords, destinationCoords, vehicleType } = req.body;

    if (!pickup || !destination) {
      return res.status(400).json({ message: "Pickup & destination required" });
    }

    // Calculate real distance if coords provided
    let distanceKm = 5; // fallback
    if (pickupCoords?.lat && destinationCoords?.lat) {
      distanceKm = parseFloat(
        haversineKm(
          pickupCoords.lat, pickupCoords.lng,
          destinationCoords.lat, destinationCoords.lng
        ).toFixed(2)
      );
    }

    const fare = calcFare(vehicleType || "car", distanceKm);

    const ride = await Ride.create({
      user: req.user.id,
      pickup,
      destination,
      pickupCoords: pickupCoords || {},
      destinationCoords: destinationCoords || {},
      vehicleType: vehicleType || "car",
      distance: distanceKm,
      fare,
    });

    // Notify all online captains
    global.io.to("captains").emit("new-ride", ride);

    res.status(201).json({ ride });
  } catch (err) {
    console.error("CREATE RIDE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

// ─── ACCEPT RIDE ──────────────────────────────────────────────────────────────
exports.acceptRide = async (req, res) => {
  try {
    const ride = await Ride.findById(req.body.rideId);
    if (!ride) return res.status(404).json({ message: "Ride not found" });
    if (ride.status !== "requested") return res.status(400).json({ message: "Ride already accepted" });

    ride.captain = req.user.id;
    ride.status = "accepted";
    await ride.save();

    // Populate captain info so the user can see driver details
    const populatedRide = await Ride.findById(ride._id).populate("captain", "fullname vehicle phone rating");

    // Send full ride object to the user (user is in room named by their userId)
    global.io.to(ride.user.toString()).emit("ride-accepted", populatedRide.toObject());

    res.json({ ride: populatedRide });
  } catch (err) {
    console.error("ACCEPT RIDE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

// ─── COMPLETE RIDE ────────────────────────────────────────────────────────────
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

// ─── RIDE HISTORY ─────────────────────────────────────────────────────────────
exports.getRideHistory = async (req, res) => {
  try {
    const rides = await Ride.find({ user: req.user.id })
      .populate("captain", "fullname vehicle")
      .sort({ createdAt: -1 })
      .limit(20);
    res.json({ rides });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ─── FARE ESTIMATE (for frontend preview) ────────────────────────────────────
exports.getFareEstimate = (req, res) => {
  const { vehicleType, distanceKm } = req.query;
  const fare = calcFare(vehicleType || "car", parseFloat(distanceKm) || 5);
  res.json({ fare });
};
