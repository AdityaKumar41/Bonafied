const mongoose = require("mongoose");

const logData = mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  view: {
    type: String,
    default: false,
  },
  verifed: {
    type: String,
    default: false,
  },
});

const LogData = mongoose.model("logdata", logData);

module.exports = LogData;
