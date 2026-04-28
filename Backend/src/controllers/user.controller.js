const User = require("../models/user.model");
const jwt = require("jsonwebtoken");

exports.registerUser = async (req, res) => {
  try {
    const { fullname, email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.json({ message: "User already exists" });
    }

    const user = await User.create({
      fullname,
      email,
      password
    });

    const token = jwt.sign({ id: user._id }, "secret");

    res.json({ token, user });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.json({ message: "Invalid email" });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.json({ message: "Wrong password" });

    const token = jwt.sign({ id: user._id }, "secret");

    res.json({ token, user });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};