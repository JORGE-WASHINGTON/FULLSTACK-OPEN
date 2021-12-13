const listHelper = require("../utils/list_helper");

test("dummy result", () => {
  const blogs = [];

  const result = listHelper.dummy(blogs);
  expect(result).toBe(1);
});
