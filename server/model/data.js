const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  id: String,
  name: String,
  university: String,
  passyear: Number,
  hashedAadhar: String,
  hash: String,
});

module.exports = mongoose.model("Student", studentSchema);
