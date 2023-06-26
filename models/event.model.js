const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const eventModel = new Schema(
  {
    username: {
      type: String,
      required: true,
    },
    mobile: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
    image: {
      imagePaths: [],
    },
    time: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Events", eventModel);
