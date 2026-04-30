const Captain = require("../models/captain.model");
const jwt = require("jsonwebtoken");

// 🚗 REGISTER CAPTAIN
exports.registerCaptain = async (req, res) => {
  try {
    const {
      fullname,
      email,
      password,
      phone,     // ✅ REQUIRED
      vehicle,
      license    // ✅ REQUIRED
    } = req.body;


    // ❌ check existing captain
    const existing = await Captain.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Captain already exists" });
    }

    // ✅ create captain
    const captain = await Captain.create({
      fullname,
      email,
      password,
      phone,
      vehicle,
      license
    });

    // 🔐 token with role
    const token = jwt.sign(
      { id: captain._id, role: "captain" },
      process.env.JWT_SECRET
    );

    res.status(201).json({ captain, token });

  } catch (err) {
    console.error("REGISTER ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};


// 🔐 LOGIN CAPTAIN
exports.loginCaptain = async (req, res) => {
  try {
    const { email, password } = req.body;

    const captain = await Captain.findOne({ email });

    if (!captain) {
      return res.status(400).json({ message: "Captain not found" });
    }

    const isMatch = await captain.comparePassword(password);

    if (!isMatch) {
      return res.status(400).json({ message: "Wrong password" });
    }

    const token = jwt.sign(
      { id: captain._id, role: "captain" },
      process.env.JWT_SECRET
    );

    res.json({ captain, token });

  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};