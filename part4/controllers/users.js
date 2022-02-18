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

// route /api/users
usersRouter.post("/", async (request, response) => {
  const body = request.body; //data sent by the client

  //backend validation
  if (body.username.length < 3 || body.password.length < 3) {
    //if validation fails responds the request with a 404 error and sends "error: "the username and password fields must have at least 3 characters"" as json data
    response.status(404).json({
      error: "the username and password fields must have at least 3 characters",
    });
  } else {
    //if validation pass creates a hashed password to be stored in the DataBase
    const passwordHash = await bcrypt.hash(body.password, 10);

    //Create a new user document to be saved in the DataBase
    const user = new User({
      username: body.username,
      name: body.name,
      password: passwordHash,
    });

    //Save user to Database
    const savedUser = await user.save();

    //Responds to the browser with status code 201 "sucess"
    response.status(201).json(savedUser);
  }
});

module.exports = usersRouter;
