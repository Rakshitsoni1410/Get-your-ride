const userModel = require("../models/user.model");
const userService = require("../services/user.service");
const { validateUser } = require("../utils/validation/user.validation");
// Register a new user

module.exports.registerUser = async (req, res, next) => {
  const errors = validateUser(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  const { firstname, lastname, email, password } = req.body;
  const hashedPassword = await userService.hashPassword(password);
  const user = await userService.createUser({
    firstname,
    lastname,
    email,
    password: hashedPassword,
  });
  const token = user.generateAuthToken();
  res.status(201).json({ token,user });

};
