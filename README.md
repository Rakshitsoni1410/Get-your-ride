# 🚖 Ride Booking App

A full-stack real-time ride booking application inspired by Uber and Ola, built using the MERN Stack, Socket.IO, and React Leaflet.

Users can:

* Book rides
* Select vehicle types
* Track drivers live on a map
* Complete ride payments
* Rate and review rides

Captains can:

* Go online/offline
* Receive ride requests in real time
* Accept rides
* Share live GPS location

---

# ✨ Features

## 👤 User Features

* User Signup/Login
* JWT Authentication
* Book Ride
* Choose Vehicle Type
* Real-time Driver Search
* Live Ride Tracking
* User Profile
* Ride Payment System
* Ride Rating & Reviews

## 🚗 Captain Features

* Captain Signup/Login
* Go Online/Offline
* Receive Ride Requests
* Accept Ride Requests
* Live GPS Location Sharing
* Ride Status Updates

## 🗺️ Real-Time Features

* Socket.IO Integration
* Real-time Ride Updates
* Live Driver Tracking
* Customer Location Sharing
* Instant Ride Acceptance
* OpenStreetMap Integration

## 💳 Payment Features

* Cash Payment
* UPI Payment
* Card Payment
* Promo Code Support
* Fare Breakdown
* Payment Confirmation Screen

## ⭐ Rating & Review Features

* 5-Star Rating System
* Driver Reviews
* Quick Feedback Tags
* Custom Comments
* Ride Feedback Submission

---

# 🛠️ Tech Stack

## Frontend

* React.js
* Tailwind CSS
* React Router DOM
* React Toastify
* Socket.IO Client
* React Leaflet
* Lucide React

## Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* Socket.IO
* JWT Authentication

---

# 📂 Project Structure

```bash
project/
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── UserLogin.jsx
│   │   │   ├── UserSignup.jsx
│   │   │   ├── UserProfile.jsx
│   │   │   ├── RideSelection.jsx
│   │   │   ├── ConfirmRide.jsx
│   │   │   ├── SearchingDriver.jsx
│   │   │   ├── RideTracking.jsx
│   │   │   ├── RideConfirmed.jsx
│   │   │   ├── payment.jsx
│   │   │   └── Ratingreview.jsx
│   │   │
│   │   ├── captain/
│   │   │   ├── CaptainSignup.jsx
│   │   │   ├── CaptainDashboard.jsx
│   │   │   └── CaptainProfile.jsx
│   │   │
│   │   ├── components/
│   │   ├── socket.js
│   │   └── App.jsx
│   │
│   └── package.json
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── services/
│   │   └── config/
│   │
│   ├── app.js
│   ├── server.js
│   └── package.json
│
└── README.md
```

---

# ⚙️ Installation

## 1️⃣ Clone Repository

```bash
git clone <your_repo_url>
```

---

# 🚀 Backend Setup

Install dependencies:

```bash
cd backend
npm install
```

Create a `.env` file:

```env
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
```

Start backend:

```bash
npm run dev
```

---

# 🎨 Frontend Setup

Install dependencies:

```bash
cd frontend
npm install
```

Start frontend:

```bash
npm run dev
```

---

# 🔌 Socket Events

## Client → Server

```text
join
captain-online
accept-ride
captain-location
customer-location
```

## Server → Client

```text
new-ride
ride-accepted
driver-location
ride-started
ride-completed
share-your-location
```

---

# 🔐 Authentication

JWT-based authentication with:

* User Roles
* Captain Roles
* Protected Routes
* Secure API Access

---

# 🗺️ Maps Integration

Uses:

* OpenStreetMap
* React Leaflet

Features:

* Live Driver Tracking
* Pickup Marker
* Destination Marker
* Dynamic Map Updates
* Route Polyline Visualization

---

# 📍 Ride Flow

```text
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
     ↓
Payment
     ↓
Rate & Review
     ↓
Back to Home
```

---

# 💳 Payment Flow

```text
Ride Completed
     ↓
Choose Payment Method
     ↓
Apply Promo Code (Optional)
     ↓
Confirm Payment
     ↓
Payment Success
```

Supported Methods:

* Cash
* UPI
* Credit Card
* Debit Card

---

# ⭐ Review Flow

```text
Payment Complete
     ↓
Give Rating
     ↓
Select Feedback Tags
     ↓
Add Comment
     ↓
Submit Review
```

---

# 🧠 Future Improvements

* Razorpay Integration
* Stripe Integration
* Ride History
* Driver Earnings Dashboard
* Chat System
* Push Notifications
* Ride Scheduling
* Nearest Captain Matching
* Real Route APIs
* Fare Estimation APIs
* Ride Cancellation Charges
* Admin Dashboard

---

# 👨‍💻 Developer

Built with ❤️ using:

* MERN Stack
* Socket.IO
* React Leaflet
* JWT Authentication
* Tailwind CSS

---

# 📜 License

This project is for educational and learning purposes.
