const express = require("express");
const router = express.Router();
const data = require("../data/index");
const movies = data.movies;
const postsData = data.posts;
const commentsData = data.comments;

router.post("/", async (req, res) => {
  // console.log(req.body);
  // console.log(req.session.user._id);
  try {
    if (!req.session) {
      throw "There is no session";
    }
    if (!req.session.user) {
      throw "You must be logged in before you can make a search";
    }
    if (!req.body) {
      throw "No body was sent with POST request";
    }
    const newComment = await commentsData.createComment(
      req.body.commentBody,
      req.body.postID,
      req.session.user._id
    );
    res.status(200).redirect(`/posts/${req.body.postID}`);
  } catch (e) {
    throw e;
  }
});

module.exports = router;
