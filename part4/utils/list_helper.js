const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  const length = blogs.length;
  switch (length) {
    case 0:
      return 0;
    case 1:
      return blogs[0].likes;
    default:
      const average = blogs.reduce((a, l) => {
        a += l.likes;
        return a;
      }, 0);
      return average / length;
  }
};

const favoriteBlog = (blogs) => {
  const likesArray = blogs.map((blog) => blog.likes);
  const maxLikes = Math.max(...likesArray);
  const favoriteBlogIndex = likesArray.indexOf(maxLikes);
  return blogs[favoriteBlogIndex];
};

const mostBlogs = (blogs) =>
  blogs.reduce(
    ({ totalBlogs, mostBlogs }, { blogs, author }) => {
      totalBlogs[author] = blogs = (totalBlogs[author] || 0) + 1;
      if (blogs > mostBlogs.blogs) mostBlogs = { author, blogs };
      return { totalBlogs, mostBlogs };
    },
    { totalBlogs: {}, mostBlogs: { blogs: 0 } }
  ).mostBlogs;

const authorWithMostLikes = (blogs) =>
  blogs.reduce(
    ({ totalLikes, authorMostLikes }, { likes, author }) => {
      totalLikes[author] = likes = (totalLikes[author] || 0) + likes;
      if (likes > authorMostLikes.likes) authorMostLikes = { author, likes };
      return { totalLikes, authorMostLikes };
    },
    { totalLikes: {}, authorMostLikes: { likes: 0 } }
  ).authorMostLikes;

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  authorWithMostLikes,
};
