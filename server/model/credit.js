const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  requestCount: { type: Number, default: 0 },
  credits: { type: Number, default: 0 },
  usedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Data",
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
