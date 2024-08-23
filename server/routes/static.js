const express = require("express");
const {
  handlePostLogin,
  handleSetData,
  handleGetDataById,
  handleGetData,
  handleVerifyOwner,
  handleSignup,
  handleLogin,
  handleProfile,
  credView,
  credVerified,
  handleGetDataByHash,
  handleLogout,
} = require("../controller/block");
const { checkCookiesAuthentication } = require("../middleware/check");
const router = express.Router();

// router.get("/login", (req, res) => {
//   res.render("login");
// });

// router.get("/set", (req, res) => {
//   res.render("setData");
// });

router.post("/login", handlePostLogin);
router.post("/set", handleSetData);
router.get("/get/:hash", handleGetDataByHash);
router.get("/get", checkCookiesAuthentication("token"), handleGetData);
router.post("/verify", checkCookiesAuthentication("token"), handleVerifyOwner);
router.post("/signupuser", handleSignup);
router.post("/loginuser", handleLogin);
router.get("/credview", credVerified);
router.get("/auth/me", handleProfile);
router.post("/logout", handleLogout);
// router.get("/profile", handleProfile);

module.exports = router;
