const express = require("express");
const { ObjectID } = require("mongodb");
const router = express.Router();
const data = require("../data/index");
const movies = data.movies;
const postsData = data.posts;
const commentsData = data.comments;
const userData = data.users;
const spaceRegex = /^\s*$/;

// This should render a page to create a post
router.get("/movieSelection", async (req, res) => {
  res.render("partials/createPost", { title: "Create a post" });
});

// get all posts

// // get post by id
// router.get("/:id", async (req, res) => {
//   try {
//     let postList = await postsData.getPost(req.params.id);
//     let allComments = commentsData.getAllComments(req.params.id);
//     res
//       .status(200)
//       .render("partials/postPage", { post: postList, comments: allComments });
//   } catch (e) {
//     res
//       .status(404)
//       .redirect("partials/allPosts", { errorMessage: "Post could be found" });
//   }
// });

// Gets post by user ID
router.get("/:id", async (req, res) => {
  const post = await postsData.getPost(req.params.id);
  const movie = await moviesData.getMovie(post.postMovieId);
  res.render("partials/postDetail", {
    title: post.postTitle,
    post: post,
    movie: movie,
  });
});

function errorHandlePostCreation(data) {
  // A post must have all the components below
  if (!data.movieId || !data.userId || !data.title || !data.description || !data.tags || !data.images) {
    throw "Missing Component for Post";
  }
  // A post must be about a movie in our movieCollection
  try {
    await postsData.getPost(ObjectID(movieId))
  } catch (e) {
    throw "Could not find the movie in the database"
  }
  // A post must be written by a user in our UserCollection
  try {
    await userData.getUserByID(ObjectID(userId))
  } catch (e) {
    throw "Could not find the user in the database"
  }
  // title must be string
  if (typeof data.title !== 'string' || spaceRegex.test(data.title)) {
    throw "Post title must be a string"
  }
  // description must be string
  if (typeof data.description !== 'string' || spaceRegex.test(data.description)) {
    throw "Post description must be a string"
  }
  // tags must be an array
  if (!Array.isArray(data.tags)) {
    throw "Tags must be an array"
  }
  // images must be an array
  if (!Array.isArray(data.images)) {
    throw "images must be an array"
  }
}
// Post is created from user input
router.post("/", async (req, res) => {
  const data = req.body;
  errorHandlePostCreation(data)
  let addedmovie = await postsData.createPost(data.movieId, data.userId, data.title, data.description, data.tags, data.images);
});

module.exports = router;
