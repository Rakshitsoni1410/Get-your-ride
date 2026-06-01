import { io } from "socket.io-client";

const socket = io("https://get-your-ride.onrender.com");

export default socket;