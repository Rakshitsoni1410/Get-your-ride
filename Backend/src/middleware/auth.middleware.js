const jwt = require("jsonwebtoken");

// ✅ USER AUTH
exports.authUser = (req, res, next) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded; // contains id

    next();
  } catch (err) {
    console.error("AUTH USER ERROR:", err);
    res.status(401).json({ message: "Invalid token" });
  }
};


// ✅ CAPTAIN AUTH (for later use)
exports.authCaptain = (req, res, next) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "captain") {
      return res.status(403).json({ message: "Access denied" });
    }

    req.user = decoded;

    next();
  } catch (err) {
    console.error("AUTH CAPTAIN ERROR:", err);
    res.status(401).json({ message: "Invalid token" });
  }
};