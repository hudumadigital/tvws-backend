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
      type: String,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Events", eventModel);
