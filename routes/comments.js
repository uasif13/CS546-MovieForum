const express = require("express");
const router = express.Router();
const data = require("../data/index");
const movies = data.movies;
const postsData = data.posts;
const commentsData = data.comments;

router.post("/", async (req, res) => {
  let commentData = req.body;
  try {
  } catch {}
  try {
    const newComment = await commentsData.createComment(
      commentsData.body,
      req.params.id,
      req.user
    );
    res.status(200).redirect("/");
  } catch (e) {}
});

module.exports = router;
