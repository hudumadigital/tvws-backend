const express = require("express");
const mongoose = require("mongoose");
const compression = require("compression");

const app = express();
require("dotenv").config();

// ROUTES IMPORTS
const authRoute = require("./routes/auth.route");

//OBJECTS
const PORT = process.env.PORT;
const MONGODB_URI = process.env.MONGODB_URI;
const mongooseOptions = {};

//MIDDLEWARES
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, X-Requested-With, Authorization"
  );
  // res.setHeader('Access-Control-Allow-Credentials', true)
  next();
});

//ROUTES USAGE
app.use("/account", authRoute);

app.use("/", (req, res, next) => {
  res.status(200).json({ api: "Welcome to the Backend feeding site" });
  next();
});

app.use((err, req, res, next) => {
  const status = err.statusCode || 500;
  const message = err._message ? err._message : err.message;
  const success = err.notSuccess ? err.notSuccess : false;
  if (err != null) {
    res.status(status).json({ message: message, success: success });
  }
  // DISPLAY ERROR MESSAGE DURING DEVELOPMENT
  console.log(err);
  next();
});

mongoose
  .connect(MONGODB_URI)
  .then((result) => {
    app.listen(PORT, (err) => {
      if (err) throw err;
      console.log("Server up and running at Port: " + PORT);
    });
  })
  .catch((err) => {
    console.log("Error occured to DB");
    console.log(err);
    app.listen(PORT, null, (err) => {
      if (err) {
        console.log(err);
        return;
      }
      console.log("Server running without DB");
    });
  });
