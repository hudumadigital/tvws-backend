const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userModel = new Schema(
  {
    firstname: {
        type: String,
        required: true,
    },
    lastname: {
        type: String,
        required: true,
    },
    email : {
        type: String,
        required: true
    },
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    mobile: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Users", userModel);
