const User = require("../models/users.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.postRegister = async (req, res, next) => {
  const { firstname, lastname, username, password, mobile, email } = req.body;
  try {
    const user = await User.findOne({ email: email });
    if (user) {
      const error = new Error("User already exists, user other email");
      error.statusCode = 401;
      throw error;
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = new User({
      username: username,
      mobile: +mobile,
      firstname: firstname,
      lastname: lastname,
      password: hashedPassword,
      email: email,
    });
    const savedUser = await newUser.save();
    if (!savedUser) {
      const error = new Error("ERROR OCCURED | COULD NOT BE REGISTERED");
      error.statusCode = 500;
      throw error;
    }
    res.status(200).json({ message: "User registered", success: true });
  } catch (error) {
    next(error);
  }
};
exports.postLogin = (req, res, next) => {};
