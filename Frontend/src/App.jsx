import { Routes, Route } from "react-router-dom";
import UserLogin from "./pages/UserLogin";
import UserSignup from "./pages/UserSignup";
import CaptainSignup from "./pages/CaptainSignup";
import Home from "./pages/Home";

function App() {
  return (
    <Routes>
      <Route path="/" element={<UserLogin />} />
      <Route path="/signup" element={<UserSignup />} />
      <Route path="/captain-signup" element={<CaptainSignup />} />
      <Route path="/home" element={<Home />} />
    </Routes>
  );
}

export default App;