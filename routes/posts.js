const express = require("express");
const router = express.Router();
const data = require("../data/index");
const movies = data.movies;
const postsData = data.posts;
const commentsData = data.comments;

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
