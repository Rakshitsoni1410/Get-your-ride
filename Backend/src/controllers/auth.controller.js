const User = require("../models/user.model");
const Captain = require("../models/captain.model");
const jwt = require("jsonwebtoken");

// 🔐 SINGLE LOGIN (USER + CAPTAIN)
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    let account = await User.findOne({ email });
    let role = "user";

    if (!account) {
      account = await Captain.findOne({ email });
      role = "captain";
    }

    if (!account) {
      return res.status(400).json({ message: "Account not found" });
    }

    const isMatch = await account.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Wrong password" });
    }

    const token = jwt.sign(
      { id: account._id, role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      role,
      user: role === "user" ? account : null,
      captain: role === "captain" ? account : null
    });

  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};


// 👤 USER REGISTER
exports.registerUser = async (req, res) => {
  try {
    const { fullname, email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({
      fullname,
      email,
      password
    });

    const token = jwt.sign(
      { id: user._id, role: "user" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      token,
      role: "user",
      user
    });

  } catch (err) {
    console.error("USER REGISTER ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};


// 🚗 CAPTAIN REGISTER
exports.registerCaptain = async (req, res) => {
  try {
    const {
      fullname,
      email,
      password,
      phone,
      vehicle,
      license
    } = req.body;

    const existing = await Captain.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Captain already exists" });
    }

    const captain = await Captain.create({
      fullname,
      email,
      password,
      phone,
      vehicle,
      license
    });

    const token = jwt.sign(
      { id: captain._id, role: "captain" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      token,
      role: "captain",
      captain
    });

  } catch (err) {
    console.error("CAPTAIN REGISTER ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};


// 🔐 CAPTAIN LOGIN (optional separate API)
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
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      role: "captain",
      captain
    });

  } catch (err) {
    console.error("CAPTAIN LOGIN ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};