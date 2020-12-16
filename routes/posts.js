const express = require("express");
const { ObjectID } = require("mongodb");
const router = express.Router();
const data = require("../data/index");
const moviesData = data.movies;
const postsData = data.posts;
const commentsData = data.comments;
const userData = data.users;
const spaceRegex = /^\s*$/;

// This should render a page to create a post
router.get("/createPostPage", async (req, res) => {
  const allMovies = await moviesData.getAllMovies();
  allMovies.forEach((movie) => {
    movie._id = movie._id.toString();
  });
  res.render("partials/createPost", {
    title: "Create a post",
    movies: allMovies,
  });
});

// Gets post by user ID
router.get("/:id", async (req, res) => {
  const post = await postsData.getPost(req.params.id);
  const movie = await moviesData.getMovie(post.postMovieId);
  const comments = await commentsData.getAllComments(req.params.id);
  res.render("partials/postPage", {
    post: post,
    movie: movie,
    comments: comments,
  });
});

async function errorHandlePostCreation(data, userId) {
  // A post must have all the components below
  if (
    !data.movie ||
    !userId ||
    !data.title ||
    !data.description ||
    !data.tags ||
    !data.image
  ) {
    throw "Missing Component for Post";
  }
  // A post must be about a movie in our movieCollection
  try {
    await postsData.getPost(ObjectID(data.movie));
  } catch (e) {
    throw "Could not find the movie in the database";
  }
  // A post must be written by a user in our UserCollection
  try {
    await userData.getUserByID(ObjectID(userId));
  } catch (e) {
    throw "Could not find the user in the database";
  }
  // title must be string
  if (typeof data.title !== "string" || spaceRegex.test(data.title)) {
    throw "Post title must be a string";
  }
  // description must be string
  if (
    typeof data.description !== "string" ||
    spaceRegex.test(data.description)
  ) {
    throw "Post description must be a string";
  }
  // tags must be an array
  if (!Array.isArray(data.tags)) {
    throw "Tags must be an array";
  }
  // images must be an array
  if (!Array.isArray(data.image)) {
    throw "images must be an array";
  }
}
// Post is created from user input
router.post("/", async (req, res) => {
  if (!req.session.user) {
    throw "Please sign in as a user";
  }
  const data = req.body;
  errorHandlePostCreation(data, req.session.user._id);
  let addedPost = await postsData.createPost(
    data.movie,
    req.session.user._id,
    data.title,
    data.description,
    data.tags,
    data.image
  );
  let movieOfPost = await moviesData.getMovie(addedPost.postMovieId);
  res.render("partials/postPage", {
    title: addedPost.title,
    post: addedPost,
    movie: movieOfPost,
    allComments: [],
  });
});

module.exports = router;
