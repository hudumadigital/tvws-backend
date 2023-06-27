const User = require("../models/users.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.postRegister = async (req, res, next) => {
  const { firstname, lastname, username, password, mobile, email, admin } =
    req.body;
  // return console.log(req.body)
  try {
    if (
      firstname == null ||
      lastname == null ||
      username == null ||
      password == null ||
      mobile == null ||
      email == null
    ) {
      throw new Error("Provide all necessary credentials");
    }
    email.toString().toLowerCase();
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
      admin: admin,
    });
    const savedUser = await newUser.save();
    if (!savedUser || savedUser == null) {
      const error = new Error("ERROR OCCURED | COULD NOT BE REGISTERED");
      error.statusCode = 500;
      throw error;
    }
    res.status(200).json({ message: "User registered", success: true });
  } catch (error) {
    next(error);
  }
};
exports.postLogin = async (req, res, next) => {
  const { password, email } = req.body;
  try {
    email.toString().toLowerCase();
    const foundUser = await User.findOne({ email: email });
    if (!foundUser) {
      const error = new Error(
        "User with email " + email + " does not exist, Consider register"
      );
      error.statusCode = 401;
      throw error;
    }
    validateHelper(password, foundUser.password, (doMatch) => {
      if (!doMatch) {
        return res
          .status(401)
          .json({ message: "Email or password is incoreect" });
      }
      if (doMatch) {
        const token = jwt.sign(
          {
            email: foundUser.email,
            userID: foundUser._id,
            // username: foundUser.username,
            // mobile: foundUser.mobile,
          },
          "secureSecurityLine",
          { expiresIn: "1hr" }
        );
        res.status(201).json({
          success: true,
          token: token,
          email: foundUser.email,
          userID: foundUser._id,
          isLoggedIn: true,
          expiresIn: 3600,
          username: foundUser.username,
          admin: foundUser.admin,
          moible: foundUser.mobile,
        });
      }
    });
  } catch (error) {
    next(error);
  }
};
const validateHelper = async (password, hashedPassword, callback) => {
  try {
    const doMatch = await bcrypt.compare(password, hashedPassword);

    if (doMatch) {
      return callback(doMatch);
    }
    return callback(false);
  } catch (error) {
    return callback(false);
  }
};
exports.deleteUser = async (req, res, next) => {
  const { email } = req.params;
  try {
    const foundUser = await User.findOne({ email: email });
    if (!foundUser) throw new Error("User not found, check the email");
    const deletedUser = await foundUser.deleteOne();
    // const deletedUser = await User.findOneAndDelete({ email: email });
    if (deletedUser) {
      res.status(200).json({
        message: `${foundUser.username} deleted successfully`,
        success: true,
      });
    }
    // throw new Error(
    //   "User could not be deleted or found, Please check the email"
    // );
  } catch (error) {
    next(error);
  }
};
exports.getUsers = async (req, res, next) => {
  // { admin: { $ne: true } }
  try {
    const foundUsers = await User.find().sort({ _id: -1 }).limit(20);
    if (foundUsers) {
      return res
        .status(201)
        .json({ message: "Users found", users: foundUsers });
    }
    throw new Error("Something went wrong");
  } catch (error) {
    next(error);
  }
};

exports.getOneUser = async (req, res, next) => {
  const { email } = req.params;
  try {
    const foundUser = await User.findOne({ email: email });
    if (!foundUser) throw new Error("Something went wrong or user not found");
    res.status(201).json({ message: "User found", user: foundUser });
  } catch (error) {
    next(error);
  }
};
