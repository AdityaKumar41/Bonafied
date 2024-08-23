const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    date: String,
    name: String,
    university: String,
    passyear: Number,
    hashedAadhar: String,
    hash: String,
    courseProgram: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Student", studentSchema);
