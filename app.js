const express = require("express");
const mongoose = require("mongoose");
const compression = require("compression");
const multer = require("multer");
const path = require("path");
const cookieParser = require("cookie-parser");

const app = express();
require("dotenv").config();

// ROUTES IMPORTS
const authRoute = require("./routes/auth.route");
const eventRoute = require("./routes/event.route");

//OBJECTS
const PORT = process.env.PORT;
const MONGODB_URI = process.env.MONGODB_URI;
const mongooseOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};
const maxSize = 1 * 1000 * 1000;

const fileFilter = (req, res, cb) => {};

const diskStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "assets/images");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      "IMG" +
        "-" +
        new Date().toISOString().split(":").join("").split("-").join("") +
        "-" +
        "TVWS_SECURITY" +
        Math.floor(1000 + Math.random() * 9000) +
        file.originalname.substring(file.originalname.indexOf("."))
    );
  },
});
//MIDDLEWARES
app.use(compression());
app.use(express.json());
// app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/assets", express.static(path.join(__dirname, "assets")));
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, X-Requested-With, Authorization, Enctype,"
  );
  // res.setHeader('Access-Control-Allow-Credentials', true)
  next();
});

//ROUTES USAGE
app.use("/account", authRoute);
app.use(eventRoute);

app.use("/", (req, res, next) => {
  res.status(200).json({ api: "Welcome to the Backend feeding site" });
  next();
});
app.use(
  multer({
    storage: diskStorage,
    fileFilter: fileFilter,
    limits: {
      fileSize: maxSize,
    },
  }).single("image")
);
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
