import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import SplashScreen from "./components/SplashScreen";

import UserLogin from "./pages/UserLogin";
import UserSignup from "./pages/UserSignup";
import Home from "./pages/Home";

import CaptainSignup from "./pages/captain/CaptainSignup";
import CaptainDashboard from "./pages/captain/CaptainDashboard";
import CaptainProfile from "./pages/captain/CaptainProfile";

import UserProfile from "./pages/UserProfile";

import RideSelection from "./pages/RideSelection";
import SearchingDriver from "./pages/SearchingDriver";
import RideTracking from "./pages/RideTracking";

import ConfirmRide from "./pages/ConfirmRide";
import RideConfirmed from "./pages/RideConfirmed";

import ProtectedRoute from "./components/ProtectedRoute";
import Payment from "./pages/payment";
import RatingReview from "./pages/Ratingreview";
import RideHistory from "./pages/ridehistory";

function App() {
  const [showSplash, setShowSplash] = useState(() => {
    // Only show splash once per session
    const seen = sessionStorage.getItem("splashSeen");
    return !seen;
  });

  const handleSplashComplete = () => {
    sessionStorage.setItem("splashSeen", "true");
    setShowSplash(false);
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} theme="dark" />

      {showSplash && <SplashScreen onComplete={handleSplashComplete} />}

      <Routes>
        {/* AUTH */}
        <Route path="/" element={<UserLogin />} />
        <Route path="/signup" element={<UserSignup />} />
        <Route path="/captain/signup" element={<CaptainSignup />} />

        {/* USER */}
        <Route
          path="/home"
          element={
            <ProtectedRoute role="user">
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/profile"
          element={
            <ProtectedRoute role="user">
              <UserProfile />
            </ProtectedRoute>
          }
        />

        {/* CAPTAIN */}
        <Route
          path="/captain/dashboard"
          element={
            <ProtectedRoute role="captain">
              <CaptainDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/captain/profile"
          element={
            <ProtectedRoute role="captain">
              <CaptainProfile />
            </ProtectedRoute>
          }
        />

        {/* RIDE FLOW */}
        <Route
          path="/ride/confirm"
          element={
            <ProtectedRoute role="user">
              <ConfirmRide />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ride/select"
          element={
            <ProtectedRoute role="user">
              <RideSelection />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ride/searching"
          element={
            <ProtectedRoute role="user">
              <SearchingDriver />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ride/tracking"
          element={
            <ProtectedRoute role="user">
              <RideTracking />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ride/confirmed"
          element={
            <ProtectedRoute role="user">
              <RideConfirmed />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ride/payment"
          element={
            <ProtectedRoute role="user">
              <Payment />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ride/rate"
          element={
            <ProtectedRoute role="user">
              <RatingReview />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ride/history"
          element={
            <ProtectedRoute role="user">
              <RideHistory />
            </ProtectedRoute>
          }
        />

        {/* FALLBACK */}
        <Route path="*" element={<h1>Page Not Found</h1>} />
      </Routes>
    </>
  );
}

export default App;
