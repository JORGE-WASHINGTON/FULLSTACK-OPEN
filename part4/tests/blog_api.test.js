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
    console.log(error);
  }
});

//4.8: Blog list tests, step1

test("return all blogs", async () => {
  const response = await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/);

  expect(response.body).toHaveLength(helper.initialBlogs.length);
});

//4.9*: Blog list tests, step2

test("the unique identifier property of the blog posts is named id", async () => {
  const response = await api.get("/api/blogs");
  response.body.forEach((blog) => {
    expect(blog.id).toBeDefined();
  });
});

//4.10: Blog list tests, step3

test("successfully creates a new blog post", async () => {
  const newBlog = {
    title: "fullstack open",
    author: "jorge",
    likes: 10,
  };

  await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const blogsAtEnd = await helper.blogsInDb();
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);

  const titles = blogsAtEnd.map((t) => t.title);
  expect(titles).toContain("fullstack open");
});

//4.11*: Blog list tests, step4

test("if the likes property is missing it will default to 0", async () => {
  const newBlog = {
    title: "fullstack open",
    author: "jorge",
  };

  await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const response = await api.get("/api/blogs");
  const lastAddedBlog = response.body[response.body.length - 1];
  expect(lastAddedBlog.likes).toBe(0);
});

//4.12*: Blog list tests, step5

test("if the title and url properties are missing, respond with 400", async () => {
  const newBlog = {
    author: "jorge",
  };

  await api.post("/api/blogs").send(newBlog).expect(400);
});

//4.13 Blog list expansions, step1

test("a single blog can be deleted", async () => {
  const blogsAtStart = await helper.blogsInDb();
  const blogToDelete = notesAtStart[0];

  await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204);

  const response = await api.get("/api/blogs");

  const titles = response.body.map((blog) => blog.title);

  expect(titles).not.toContain(blogToDelete.title);
});

//4.14 Blog list expansions, step2

test("a single blog can be updated", async () => {
  const notesAtStart = await helper.blogsInDb();
  const blogToUpdate = notesAtStart[0];
  const updatedBlog = {
    title: "this blog was updated",
  };

  await api.put(`/api/blogs/${blogToUpdate.id}`).send(updatedBlog).expect(200);

  const response = await api.get("/api/blogs");
  const titles = response.body.map((blog) => blog.title);
  expect(titles).toContain(updatedBlog.title);
  expect(titles).not.toContain(blogToUpdate.title);
});

afterAll(() => {
  mongoose.connection.close();
});
