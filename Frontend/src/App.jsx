import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
import RideConfirmed from "./pages/RideConfirmed"; // ✅ MUST EXIST

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <>
      <ToastContainer />

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

        {/* 🚗 RIDE FLOW (CLEAN ORDER) */}

        {/* CONFIRM RIDE */}
        <Route
          path="/ride/confirm"
          element={
            <ProtectedRoute role="user">
              <ConfirmRide />
            </ProtectedRoute>
          }
        />

        {/* SELECT RIDE */}
        <Route
          path="/ride/select"
          element={
            <ProtectedRoute role="user">
              <RideSelection />
            </ProtectedRoute>
          }
        />

        {/* SEARCH DRIVER */}
        <Route
          path="/ride/searching"
          element={
            <ProtectedRoute role="user">
              <SearchingDriver />
            </ProtectedRoute>
          }
        />

        {/* LIVE TRACKING */}
        <Route
          path="/ride/tracking"
          element={
            <ProtectedRoute role="user">
              <RideTracking />
            </ProtectedRoute>
          }
        />

        {/* SUCCESS PAGE */}
        <Route
          path="/ride/confirmed"
          element={
            <ProtectedRoute role="user">
              <RideConfirmed />
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