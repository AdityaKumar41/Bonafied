const jwt = require("jsonwebtoken");
require("dotenv").config();
const secret = process.env.SECRET;
function setUserAuth(user) {
  const payload = {
    _id: user._id,
    email: user.email,
  };
  return jwt.sign(payload, secret);
}

function getVerifyAuth(token) {
  if (!token) null;
  try {
    return jwt.verify(token, secret);
  } catch (e) {
    console.log(e);
  }
}

module.exports = {
  setUserAuth,
  getVerifyAuth,
};
