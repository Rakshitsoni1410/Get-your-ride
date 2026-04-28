const express = require("express");
const cors = require("cors");
const captainRoutes = require("./src/routes/captain.routes");
const rideRoutes = require("./src/routes/ride.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/captain", captainRoutes);

app.use("/api/ride", rideRoutes);
app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

module.exports = app;