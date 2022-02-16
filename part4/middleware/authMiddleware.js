/* const jwt = require("jsonwebtoken");

const authMiddleware = (request, response, next) => {
  console.log(request.token);
  const token = request.token;
  if (!token) {
    return response.status(401).json({ error: "No token provided" });
  }
  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    if (decodedToken.id) {
      request.userId = decodedToken.id;
    }
  } catch (error) {
    console.log(error.name);
  }

  next();
};

module.exports = authMiddleware;
 */
