// Import all data functions
const userData = require("./users");
const commentData = require("./comments");
const moviesData = require("./movies");
const postsData = require("./posts");

module.exports = {
  // Export the functions
  users: userData,
  movies: moviesData,
  posts: postsData,
  comments: commentData,
};
