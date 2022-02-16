const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userExtractor = async (request, response, next) => {
  const authorization = request.get("authorization");
  if (authorization) {
    try {
      const decodedToken = jwt.verify(
        authorization.substring(7),
        process.env.JWT_SECRET
      );
      request.user = await User.findOne({ username: decodedToken.username });
    } catch (error) {
      console.log(error);
    }

    return next();
  }
  return next();
};

module.exports = userExtractor;
