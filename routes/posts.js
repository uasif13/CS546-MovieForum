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

// This should render a page to create a post
router.get("/createPostPage", async (req, res) => {
  try {
    if (!req.session) {
      throw "There is no session";
    }
    if (!req.session.user) {
      throw "You must be logged in before you can make a search";
    }
    const allMovies = await moviesData.getAllMovies();
    allMovies.forEach((movie) => {
      movie._id = movie._id.toString();
    });
    res.render("partials/createPost", {
      title: "Create a post",
      movies: allMovies,
    });
  } catch (e) {
    res.status(500).send(e);
  }
});

// Gets post by user ID
router.get("/:id", async (req, res) => {
  try {
    if (!req.session) {
      throw "There is no session";
    }
    if (!req.session.user) {
      throw "You must be logged in before you can make a search";
    }
    if (!req.params.id) {
      throw "You must provide a post id to query the database for";
    }

    const post = await postsData.getPost(xss(req.params.id));
    const movie = await moviesData.getMovie(post.postMovieId);
    const allComments = await commentsData.getAllComments(xss(req.params.id));

    res.render("partials/postPage", {
      post: post,
      movie: movie,
      comments: allComments,
    });
  } catch (e) {
    res.status(500).send(e);
  }
});

async function errorHandlePostCreation(data, userId) {
  // A post must have all the components below
  try {
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
      await postsData.getPost(ObjectID(xss(data.movie)));
    } catch (e) {
      throw "Could not find the movie in the database";
    }
    // A post must be written by a user in our UserCollection
    try {
      await userData.getUserByID(ObjectID(xss(userId)));
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
  } catch (e) {
    throw e;
  }
}
// Post is created from user input
router.post("/", async (req, res) => {
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
    const data = req.body;
    console.log(data);
    await errorHandlePostCreation(data, req.session.user._id);
    let addedPost = await postsData.createPost(
      xss(data.movie),
      xss(req.session.user._id),
      xss(data.title),
      xss(data.description),
      xss(data.tags),
      xss(data.image)
    );
    let movieOfPost = await moviesData.getMovie(addedPost.postMovieId);
    res.render("partials/postPage", {
      title: addedPost.title,
      post: addedPost,
      movie: movieOfPost,
      allComments: [],
    });
  } catch (e) {
    res.status(400).render("partials/createPost", { error: e });
  }
});

router.get("/delete/:id", async (req, res) => {
  try {
    if (!req.session) {
      throw "There is no session";
    }
    if (!req.session.user) {
      throw "You must be logged in before you can make a search";
    }
  } catch (e) {
    res.status(500).send(e);
  }
  let postID = req.params.id;
  let userID = req.session.user._id;
  const post = await postsData.getPost(postID);

  if (post.postuserId === userID) {
    try {
      //console.log("calling remove data");
      let post = await postsData.getPost(postID);
      let commentsList = post.postReplies;
      if (Array.isArray(commentsList) && commentsList.length) {
        await commentsData.deleteAllCommentsOfPost(postID);
      }
      await postsData.removePost(postID);
      // const postsList = await postsData.getAllPosts();
      // postsList.sort((a, b) => (a.postLikes > b.postLikes ? 1 : -1));
    } catch (e) {
      // console.log("inside here");
      // const postsList = await postsData.getAllPosts();
      // postsList.sort((a, b) => (a.postLikes > b.postLikes ? 1 : -1));
      res.redirect("/");
    }
    res.redirect("/");
  } else {
    // const postsList = await postsData.getAllPosts();
    // postsList.sort((a, b) => (a.postLikes > b.postLikes ? 1 : -1));
    res.render("partials/createPost");
  }
});

module.exports = router;
