const mongoose = require("mongoose");
const supertest = require("supertest");
const helper = require("./blog_api_helper");
const app = require("../app");
const api = supertest(app);
const Blog = require("../models/blog");

beforeEach(async () => {
  try {
    await Blog.deleteMany({});
    const blogObjects = helper.initialBlogs.map((blog) => new Blog(blog));
    const promiseArray = blogObjects.map((blog) => blog.save());
    await Promise.all(promiseArray);
  } catch (error) {
    next(error);
  }
});

test("return all blogs", async () => {
  try {
    const response = await api.get("/api/blogs");
    expect(response.body).toHaveLength(helper.initialBlogs.length);
  } catch (error) {
    next(error);
  }
});

afterAll(() => {
  mongoose.connection.close();
});
