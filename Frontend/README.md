🚖 Ride Booking App

A full-stack real-time ride booking application inspired by Uber/Ola.

Users can:

Book rides
Select vehicle types
Track drivers live on map

Captains can:

Go online/offline
Receive ride requests in real time
Accept rides
Share live GPS location
✨ Features
👤 User Features
User Signup/Login
Book Ride
Choose Vehicle
Real-time Driver Search
Live Ride Tracking
User Profile
🚗 Captain Features
Captain Signup/Login
Go Online/Offline
Receive Ride Requests
Accept Ride
Live Location Sharing
🗺️ Real-Time Features
Socket.IO Integration
Live Driver Tracking
Real-time Ride Updates
OpenStreetMap + Leaflet Maps
🛠️ Tech Stack
Frontend
React.js
Tailwind CSS
React Router DOM
React Toastify
Socket.IO Client
React Leaflet
Lucide React
Backend
Node.js
Express.js
MongoDB
Mongoose
Socket.IO
JWT Authentication
📂 Project Structure
project/
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── socket.js
│   │   └── App.jsx
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middleware/
│   │   └── config/
│   │
│   ├── app.js
│   └── server.js
⚙️ Installation
1️⃣ Clone Repository
git clone <your_repo_url>
🚀 Backend Setup
Install dependencies
cd backend
npm install
Create .env
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
Start backend
npm run dev
🎨 Frontend Setup
Install dependencies
cd frontend
npm install
Start frontend
npm run dev
🔌 Socket Events
Client → Server
join
captain-online
accept-ride
captain-location
Server → Client
new-ride
ride-accepted
driver-location
🔐 Authentication

JWT-based authentication with:

User roles
Captain roles
Protected routes
🗺️ Maps

Uses:

OpenStreetMap
React Leaflet

Features:

Live marker movement
Driver tracking
Pickup & destination markers
Route polyline
📍 Ride Flow
User Login
   ↓
Book Ride
   ↓
Select Vehicle
   ↓
Ride Created
   ↓
Captain Receives Request
   ↓
Captain Accepts Ride
   ↓
Live Tracking Starts
   ↓
Ride Completed
🧠 Future Improvements
Payment Gateway
Nearest Captain Matching
Ride History
Ratings & Reviews
Chat System
Push Notifications
Real Route APIs
Fare Estimation APIs
👨‍💻 Developer

Built with ❤️ using MERN Stack + Socket.IO

📜 License

This project is for educational purposes.
