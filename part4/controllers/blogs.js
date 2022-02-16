const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

blogsRouter.post("/", async (request, response) => {
  if (!request.token) {
    return response.status(401).json({ error: "No token provided" });
  }
  const body = request.body;
  try {
    const decodedToken = jwt.verify(request.token, process.env.JWT_SECRET);
    if (!decodedToken.id) {
      return response.status(401).json({ error: "token missing or invalid" });
    }

    if (!body.title && !body.url) {
      return response
        .status(400)
        .json({ error: "The title and URL fields are required" });
    }
    const user = request.user;

    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes,
      user: user,
    });

    const savedBlog = await blog.save();
    user.blogs = user.blogs.concat(savedBlog.id);
    await user.save();
    response.status(201).json(savedBlog);
  } catch (error) {
    console.log(error);
  }
});

blogsRouter.get("/", async (request, response) => {
  try {
    const blogs = await Blog.find({}).populate("user", {
      username: 1,
      name: 1,
    });
    response.json(blogs);
  } catch (error) {
    console.log(error);
  }
});

blogsRouter.delete("/:id", async (request, response) => {
  if (!request.token) {
    response.status(401).json({ error: "No token provided" });
  } else {
    try {
      const decodedToken = jwt.verify(request.token, process.env.JWT_SECRET);
      if (!decodedToken.id) {
        return response.status(401).json({ error: "token missing or invalid" });
      }
      const blogToDelete = await Blog.findById(request.params.id);
      console.log(blogToDelete);
      if (blogToDelete.user.toString() === decodedToken.id) {
        await Blog.deleteOne({ _id: blogToDelete.id });
        response.status(200).end();
      } else {
        response.status(401).json({
          error: "The current user cannot delete blogs posted by other users",
        });
      }
      response.status(201).end();
    } catch (error) {
      console.log(error);
    }
  }
});

blogsRouter.put("/:id", async (request, response) => {
  const body = request.body;
  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  };
  try {
    const id = request.params.id;
    const updatedBlog = await Blog.findByIdAndUpdate(id, blog, { new: true });
    response.json(updatedBlog);
  } catch (error) {
    console.log(error);
  }
});

module.exports = blogsRouter;
