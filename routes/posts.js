const express = require("express");
const router = express.Router();
const data = require("../data/index");
const moviesData = data.movies;
const postsData = data.posts;

// This should render a page to create a post
router.get("/movieSelection", async (req, res) => {
  res.render("partials/createPost", { title: "Create a post" });
});
router.get("/:id", async (req, res) => {
  const post = await postsData.getPost(req.params.id);
  const movie = await moviesData.getMovie(post.postMovieId);
  res.render("partials/postDetail", {
    title: post.postTitle,
    post: post,
    movie: movie,
  });
});
router.post("/", async (req, res) => {});
module.exports = router;
