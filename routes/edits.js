const express = require("express");
const { ObjectID } = require("mongodb");
const router = express.Router();
const data = require("../data/index");
const moviesData = data.movies;
const postsData = data.posts;
const commentsData = data.comments;
const userData = data.users;
const spaceRegex = /^\s*$/;
const xss = require("xss");

router.get("/:id", async (req, res) => {
  let postID = req.params.id;
  const post = await postsData.getPost(postID);
  res.render("/partials/editPost", { post: post });
});

module.exports = router;
