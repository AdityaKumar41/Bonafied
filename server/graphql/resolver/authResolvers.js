const User = require("../../model/User");
const { hashPassword, createJWT } = require("../../utils/auth");

const authResolvers = {
  Mutation: {
    signup: async (
      _,
      { firstname, lastname, organizationName, email, url, password }
    ) => {
      const { salt, hash } = hashPassword(password);
      const newUser = new User({
        firstname,
        lastname,
        organizationName,
        email,
        url,
        hashPassword: hash,
        salt,
      });
      await newUser.save();

      const token = createJWT(newUser.id);

      return {
        token,
        user: newUser,
      };
    },
  },
};

module.exports = authResolvers;
