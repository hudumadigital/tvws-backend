const axios = require("axios");
const Event = require("../models/event.model");

exports.getEvents = async (req, res, next) => {};

exports.reportEvent = async (req, res, next) => {
  console.log("helo");
  try {
    const image = req.file;
    const { time, description } = req.body;
    const { username, mobile } = req.user;

    let paths = [];
    console.log(image);
    paths.push(image.path);

    const event = new Event({
      time: time,
      description: description,
      username: username,
      mobile: mobile,
      image: { imagePaths: paths },
    });
    const savedEvent = await event;

    if (!savedEvent) {
      const error = new Error("Event was not saved into the db");
      error.statusCode = 500;
      throw error;
    }
    res.status(200).json({ message: "Reported successfully" });
  } catch (error) {
    next(error);
  }
};

exports.getReports = async (req, res, next) => {};
