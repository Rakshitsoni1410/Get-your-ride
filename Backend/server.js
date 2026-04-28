require("dotenv").config();
const http = require("http");
const app = require("./app");

const connectDB = require("./src/config/db");
connectDB(); // ✅ THIS WAS MISSING

const server = http.createServer(app);

// socket setup
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: { origin: "*" }
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});