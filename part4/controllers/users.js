const User = require("../models/user");
const bcrypt = require("bcrypt");
const usersRouter = require("express").Router();

usersRouter.get("/", async (request, response) => {
  const users = await User.find({}).populate("blogs", {
    url: 1,
    title: 1,
    author: 1,
    id: 1,
  });
  response.json(users);
});

usersRouter.post("/", async (request, response) => {
  const body = request.body;

  if (body.username.length < 3 || body.password.length < 3) {
    response.status(404).json({
      error: "the username and password fields must have at least 3 characters",
    });
  } else {
    const passwordHash = await bcrypt.hash(body.password, 10);

    const user = new User({
      username: body.username,
      name: body.name,
      password: passwordHash,
    });

    const savedUser = await user.save();
    response.status(201).json(savedUser);
  }
});

module.exports = usersRouter;
