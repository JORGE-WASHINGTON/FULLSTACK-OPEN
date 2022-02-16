const tokenExtractor = (request, response, next) => {
  const authorization = request.get("authorization");
  if (authorization) {
    request.token = authorization.substring(7);
    return next();
  }
  return next();
};

module.exports = tokenExtractor;
