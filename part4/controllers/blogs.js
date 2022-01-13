const blogsRouter = require("express").Router();
const Blog = require("../models/blog");

blogsRouter.get("/", async (request, response) => {
  try {
    const blogs = await Blog.find({});
    response.json(blogs);
  } catch (error) {
    console.log(error);
  }
});

blogsRouter.post("/", async (request, response) => {
  if (!request.body.title && !request.body.url) {
    response.status(400).end();
  } else {
    try {
      const blog = new Blog(request.body);
      const savedBlog = await blog.save();
      response.status(201).json(savedBlog);
    } catch (error) {
      console.log(error);
    }
  }
});

blogsRouter.delete("/:id", async (request, response) => {
  try {
    await Blog.findByIdAndRemove(request.params.id);
    response.status(204).end();
  } catch (error) {
    console.log(error);
  }
});

blogsRouter.put("/:id", async (request, response) => {
  const body = request.body;
  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    liked: body.likes,
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
