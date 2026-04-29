const User = require("../models/user.model");
const Captain = require("../models/captain.model");
const jwt = require("jsonwebtoken");

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
      process.env.JWT_SECRET
    );

    res.json({ token, role });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};