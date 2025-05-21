const { validationResult } = require("express-validator");
const userService = require("../services/user.service");
const userModel = require("../models/user.model"); // ✅ required for login
const blacklistTokenModel = require("../models/blacklistToken.model"); // ✅ required for logout
// Register a new user
module.exports.registerUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { fullname, email, password } = req.body;
  const hashedPassword = await userService.hashPassword(password);

  const user = await userService.createUser({
    firstname: fullname.firstname,
    lastname: fullname.lastname,
    email,
    password: hashedPassword,
  });

  const token = user.generateAuthToken();
  res.status(201).json({ token, user });
};

// Login user
module.exports.loginUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;
  const user = await userModel.findOne({ email }).select("+password");

  if (!user) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const token = user.generateAuthToken();
  res.cookie("token", token); // ✅ Set cookie
  res.status(200).json({ token, user }); // ✅ Single response
};

// Get user profile
module.exports.getUserProfile = async (req, res, next) => {
  res.status(200).json(req.user);
};
// Logout user
module.exports.logoutUser = async (req, res, next) => {
  res.clearCookie("token"); // ✅ Clear cookie
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
  await blacklistTokenModel.create({ token });
  res.status(200).json({ message: "Logged out successfully" });
};
