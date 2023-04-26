const route = require("express").Router();

const authController = require("../controllers/auth.controller");

route.post("/register", authController.postRegister);

route.post("/login", authController.postLogin);

route.delete("/delete/:email", authController.deleteUser);

// /user/:id
route.get("/user/:email", authController.getOneUser);

route.get("/users", authController.getUsers);

module.exports = route;
