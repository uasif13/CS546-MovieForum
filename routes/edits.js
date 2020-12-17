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
const { route } = require("./posts");

router.get("/:id", async (req, res) => {
  let postID = req.params.id;
  const post = await postsData.getPost(postID);
  res.render("partials/editPost", { post: post });
});

router.post("/:id", async (req, res) => {
  const editedPost = req.body;
  let parsingPostData = {
    postTitle: editedPost.title,
    postBody: editedPost.description,
    postTags: editedPost.tags,
    //postImage: `../../public/assets/${editedPost.image}`,
  };
  console.log(parsingPostData);
  try {
    let postEdited = await postsData.editPost(
      editedPost.postID,
      parsingPostData
    );
    res.redirect(`/posts/${editedPost.postID}`);
  } catch (e) {
    throw e;
  }
});
module.exports = router;
