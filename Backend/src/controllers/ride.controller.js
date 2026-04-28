const Ride = require("../models/ride.model");   // import model

exports.createRide = async (req, res) => {
  try {

    const { pickup, destination } = req.body;   // get data from request

    const fare = Math.floor(Math.random() * 500) + 50;  // dummy fare

    const ride = await Ride.create({            // create ride in DB
      user: req.user.id,                        // from JWT
      pickup,
      destination,
      fare
    });

    res.json({ ride });                         // send response

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};