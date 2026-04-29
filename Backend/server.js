require("dotenv").config();
const http = require("http");
const app = require("./app");

const connectDB = require("./src/config/db");
connectDB();

const server = http.createServer(app);

// 🔥 SOCKET SETUP
const { Server } = require("socket.io");

const io = new Server(server, {
  cors: { origin: "*" }
});

// ✅ make global (used in controllers)
global.io = io;

// 🔥 STORE ONLINE CAPTAINS
const onlineCaptains = {};

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // 🔹 JOIN ROOM
  socket.on("join", ({ userId, role }) => {
    if (!userId || !role) return;

    socket.join(userId);
    socket.userId = userId;
    socket.role = role;

    console.log(`${role} joined room: ${userId}`);
  });

  // 🔹 CAPTAIN ONLINE
  socket.on("captain-online", (captainId) => {
    onlineCaptains[captainId] = socket.id;

    socket.join("captains");

    console.log("Captain online:", captainId);
  });

  // 🔥 NEW RIDE REQUEST → SEND TO ALL CAPTAINS
  socket.on("request-ride", (ride) => {
    console.log("Ride requested:", ride);

    io.to("captains").emit("new-ride", ride);
  });

  // 🔥 CAPTAIN ACCEPT RIDE
  socket.on("accept-ride", ({ rideId, userId, captainId }) => {
    console.log("Ride accepted:", rideId);

    // send to that specific user
    io.to(userId).emit("ride-accepted", {
      rideId,
      captainId
    });
  });

  // 🔥 LIVE LOCATION TRACKING (IMPORTANT FIX)
  socket.on("captain-location", ({ rideId, location }) => {
    if (!rideId || !location) return;

    // send ONLY to that ride user
    io.to(rideId).emit("driver-location", location);
  });

  // 🔹 DISCONNECT
  socket.on("disconnect", () => {
    console.log("Disconnected:", socket.id);

    // remove captain from online list
    for (let id in onlineCaptains) {
      if (onlineCaptains[id] === socket.id) {
        delete onlineCaptains[id];
      }
    }
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});