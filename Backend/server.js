require("dotenv").config();
const http = require("http");
const app = require("./app");
const connectDB = require("./src/config/db");

connectDB();

const server = http.createServer(app);
const { Server } = require("socket.io");

const io = new Server(server, { cors: { origin: "*" } });
global.io = io;

// Track socket → userId mapping for cleanup
const socketToUser = {}; // socketId → { userId, role }

io.on("connection", (socket) => {
  console.log("🔌 Connected:", socket.id);

  // ─── JOIN ROOM ───────────────────────────────────────────────────
  // Both users and captains call this. They join a room named after their userId.
  socket.on("join", ({ userId, role }) => {
    if (!userId || !role) return;
    socket.join(userId);
    socket.userId = userId;
    socket.role = role;
    socketToUser[socket.id] = { userId, role };
    console.log(`✅ ${role} ${userId} joined room`);
  });

  // ─── CAPTAIN GOES ONLINE ─────────────────────────────────────────
  // Captain joins the shared "captains" room to receive ride broadcasts
  socket.on("captain-online", (captainId) => {
    socket.join("captains");
    socket.captainId = captainId;
    console.log(`🟢 Captain ${captainId} is online`);
  });

  // ─── CAPTAIN ACCEPTS RIDE (frontend emits this after API call) ────
  // We notify the user that their ride was accepted
  socket.on("accept-ride", ({ rideId, userId, captainId }) => {
    console.log(`🚗 Captain ${captainId} accepted ride ${rideId} for user ${userId}`);
    // User is in room named userId — emit there
    io.to(userId).emit("ride-accepted-socket", { rideId, captainId });
  });

  // ─── DRIVER LIVE LOCATION ─────────────────────────────────────────
  // Captain emits this every few seconds while on a ride.
  // We broadcast to: (1) the user (by userId), (2) the ride room (by rideId)
  socket.on("driver-location", ({ rideId, userId, location }) => {
    if (!location) return;
    console.log(`📍 Driver location for ride ${rideId}:`, location);
    if (userId) io.to(userId).emit("driver-location", location);
    if (rideId) io.to(rideId).emit("driver-location", location);
  });

  // ─── CAPTAIN REQUESTS CUSTOMER LOCATION ───────────────────────────
  // Captain asks user to share their GPS
  socket.on("request-customer-location", ({ userId }) => {
    io.to(userId).emit("share-your-location");
  });

  // ─── USER SHARES THEIR LOCATION TO CAPTAIN ─────────────────────────
  socket.on("customer-location", ({ captainId, location }) => {
    io.to(captainId).emit("customer-location", location);
  });

  // ─── RIDE COMPLETED (from captain dashboard) ───────────────────────
  socket.on("ride-completed-socket", ({ rideId, userId }) => {
    if (userId) io.to(userId).emit("ride-completed", { rideId });
    console.log(`✅ Ride ${rideId} completed`);
  });

  // ─── DISCONNECT ───────────────────────────────────────────────────
  socket.on("disconnect", () => {
    const info = socketToUser[socket.id];
    if (info) {
      console.log(`🔴 ${info.role} ${info.userId} disconnected`);
      delete socketToUser[socket.id];
    }
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
