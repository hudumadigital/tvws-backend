const jwt = require("jsonwebtoken");
// Existence and Validity
const User = require("../models/users.model");

module.exports = async (req, res, next) => {
  // console.log("hello");
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    const err = new Error("Not Authenticated consider login");
    err.statusCode = 401;
    throw err;
  }
  const token = authHeader.split(" ")[1];
  let decodedToken;

  try {
    decodedToken = jwt.verify(token, "secureSecurityLine");
  } catch (error) {
    error.success = false;
    error.statusCode = 500;
    error.message = "Session expired, consider login";
    return next(error);
  }

  req.userID = decodedToken.userID;
  // req.email = decodedToken.email;
  // req.username = decodedToken.username;
  // req.mobile = decodedToken.mobile;
  try {
    const result = await User.findById(req.userID);
    if (result === null) {
      const error = new Error(
        "Not Authenticated OR session expired, consider login"
      );
      error.success = false;
      error.statusCode = 401;
      throw error;
    }
    req.user = result;
  } catch (error) {
    return next(error);
  }
  next();
};
