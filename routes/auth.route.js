const route = require("express").Router();

const authController = require("../controllers/auth.controller");

route.post("/register", authController.postRegister);

route.post("/login", authController.postLogin);

module.exports = route;
