const { createHmac, randomBytes } = require("crypto");
const { Schema, model } = require("mongoose");
const { setUserAuth } = require("../utils/auth");

const userSchema = new Schema(
  {
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    salt: { type: String },
    organizationName: { type: String, required: true },
    organizationURL: { type: String, required: true },
  },
  { timestamps: true }
);

// hashed the password before save in database
userSchema.pre("save", function (next) {
  const user = this;
  if (!user.isModified("password")) return;
  const salt = randomBytes(16).toString("hex");

  const hashedPassword = createHmac("sha256", salt)
    .update(user.password)
    .digest("hex");

  this.salt = salt;
  this.password = hashedPassword;
  next();
});

userSchema.static("checkPassword", async function (email, password) {
  const user = await this.findOne({ email });
  console.log(user);
  if (!user) throw new Error("User not found!");
  const salt = user.salt;
  const hashedPassword = user.password;

  const userHashedPassword = createHmac("sha256", salt)
    .update(password)
    .digest("hex");

  if (hashedPassword !== userHashedPassword)
    throw new Error("In correct Password");
  const token = setUserAuth(user);
  return token;
});

const modelUser = model("users", userSchema);

module.exports = modelUser;
