const { getVerifyAuth } = require("../utils/auth");

function checkCookiesAuthentication(cookies) {
  return function (req, res, next) {
    const cookiesValue = req.cookies[cookies];
    if (!cookiesValue) return next();

    try {
      const validUser = getVerifyAuth(cookiesValue);
      req.user = validUser;
    } catch (e) {}
    return next();
  };
}

module.exports = {
  checkCookiesAuthentication,
};
