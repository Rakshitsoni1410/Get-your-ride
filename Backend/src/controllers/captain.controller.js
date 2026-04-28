const Captain = require("../models/captain.model");
const jwt = require("jsonwebtoken");

exports.registerCaptain = async (req, res) => {
  try {
    const { fullname, email, password, vehicle } = req.body;

    const captain = await Captain.create({
      fullname,
      email,
      password,
      vehicle
    });

    const token = jwt.sign({ id: captain._id }, process.env.JWT_SECRET);

    res.json({ captain, token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.loginCaptain = async (req, res) => {
  try {
    const { email, password } = req.body;

    const captain = await Captain.findOne({ email });
    if (!captain) return res.status(400).json({ message: "Not found" });

    const isMatch = await captain.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: "Wrong password" });

    const token = jwt.sign({ id: captain._id }, process.env.JWT_SECRET);

    res.json({ captain, token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};