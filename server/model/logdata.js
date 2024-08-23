const mongoose = require("mongoose");

const logData = mongoose.Schema({
  hash: {
    type: String,
    required: true,
  },
  view: {
    type: String,
    default: false,
  },
  verified: {
    type: String,
    default: false,
  },
});

const LogData = mongoose.model("logdata", logData);

module.exports = LogData;
