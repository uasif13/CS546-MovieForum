// Import all data functions
const userData = require("./users");
const moviesData = require("./movies");
const postsData = require("./posts");
const commentsData = require("./comments")
module.exports = {
  // Export the functions
  users: userData,
  movies: moviesData,
  posts: postsData,
  comments: commentsData,
};
