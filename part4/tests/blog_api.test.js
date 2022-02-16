const mongoose = require("mongoose");
const supertest = require("supertest");
const helper = require("./blog_api_helper");
const app = require("../app");
const api = supertest(app);
const Blog = require("../models/blog");
const User = require("../models/user");
const userHelper = require("./users_api_helper");
const bcrypt = require("bcrypt");

beforeEach(async () => {
  try {
    await Blog.deleteMany({});
    await User.deleteMany({});
    const testUser = new User({
      username: "test",
      name: "test",
      password: await bcrypt.hash("test", 10),
    });
    await testUser.save();
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

  const loginResponse = await api
    .post("/api/login")
    .send({ username: "test", password: "test" });

  await api
    .post("/api/blogs")
    .send(newBlog)
    .set({
      Authorization: `Bearer ${loginResponse.body.token}`,
    })
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

  const loginResponse = await api
    .post("/api/login")
    .send({ username: "test", password: "test" });

  await api
    .post("/api/blogs")
    .send(newBlog)
    .set({
      Authorization: `Bearer ${loginResponse.body.token}`,
    })
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

  const loginResponse = await api
    .post("/api/login")
    .send({ username: "test", password: "test" });

  await api
    .post("/api/blogs")
    .send(newBlog)
    .set({
      Authorization: `Bearer ${loginResponse.body.token}`,
    })
    .expect(400)
    .expect("Content-Type", /application\/json/);
});

//4.13 Blog list expansions, step1
test("a single blog can be deleted", async () => {
  const loginResponse = await api
    .post("/api/login")
    .send({ username: "test", password: "test" });

  const newBlog = {
    title: "fullstack open",
    author: "jorge",
    likes: 10,
  };

  const createResponse = await api
    .post("/api/blogs")
    .send(newBlog)
    .set({
      Authorization: `Bearer ${loginResponse.body.token}`,
    });

  const blogsAfterCreation = await helper.blogsInDb();
  expect(blogsAfterCreation).toHaveLength(7);

  const blogToDelete = createResponse.body;

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .set({ Authorization: `Bearer ${loginResponse.body.token}` })
    .expect(200);

  const blogsAfterDeletion = await helper.blogsInDb();

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

//4.16 bloglist expansion, step4
//Also, implement tests which check that invalid users are not created and invalid add user operation returns a suitable status code and error message.
test("invalid users are not created", async () => {
  const usersAtStart = await userHelper.usersInDb();

  const newUser = {
    username: "fa",
    password: "il",
  };

  await api
    .post("/api/users")
    .send(newUser)
    .expect(404)
    .expect("Content-Type", /application\/json/);

  const usersAtEnd = await userHelper.usersInDb();
  expect(usersAtEnd).toHaveLength(usersAtStart.length);
});

afterAll(() => {
  mongoose.connection.close();
});

//4.23 adding a blog fails with the proper status code 401 Unauthorized if a token is not provided.
test("adding a blog fails if token is not provided", async () => {
  const blogsAtStart = await helper.blogsInDb();

  const newBlog = {
    title: "fullstack open",
    author: "jorge",
  };

  await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(401)
    .expect("Content-Type", /application\/json/);

  const blogsAtEnd = await helper.blogsInDb();
  expect(blogsAtEnd).toHaveLength(blogsAtStart.length);
});
