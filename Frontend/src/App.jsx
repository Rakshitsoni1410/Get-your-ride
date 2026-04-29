import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import UserLogin from "./pages/UserLogin";
import UserSignup from "./pages/UserSignup";
import Home from "./pages/Home";

import CaptainSignup from "./pages/captain/CaptainSignup";
import CaptainDashboard from "./pages/captain/CaptainDashboard";
import CaptainProfile from "./pages/captain/CaptainProfile";

import ProtectedRoute from "./components/ProtectedRoute";
import UserProfile from "./pages/UserProfile";
import RideSelection from "./pages/RideSelection";
import SearchingDriver from "./pages/SearchingDriver";
function App() {
  return (
    <>
      <ToastContainer />

      <Routes>
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

        {/* CAPTAIN DASHBOARD */}
        <Route
          path="/captain/dashboard"
          element={
            <ProtectedRoute role="captain">
              <CaptainDashboard />
            </ProtectedRoute>
          }
        />

        {/* ✅ CAPTAIN PROFILE (NEW ROUTE) */}
        <Route
          path="/captain/profile"
          element={
            <ProtectedRoute role="captain">
              <CaptainProfile />
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
        {/* RIDE SELECTION */}
        <Route
          path="/ride/select"
          element={
            <ProtectedRoute role="user">
              <RideSelection />
            </ProtectedRoute>
          }
        />
        {/*seaching the ride */}
        <Route path="/ride/searching" element={<SearchingDriver />} />
        {/* OPTIONAL */}
        <Route path="*" element={<h1>Page Not Found</h1>} />
      </Routes>
    </>
  );
}

export default App;
