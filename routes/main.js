const express = require("express");
const router = express.Router();
const data = require("../data");
const postsData = data.posts;
const moviesData = data.movies;
const bcrypt = require("bcrypt");
const userData = data.users;
const mongoCollections = require("../config/mongoCollections");
const users = mongoCollections.users;
const posts = mongoCollections.posts;
const xss = require("xss")

function ciEquals(a, b) {
  return typeof a === "string" && typeof b === "string"
    ? a.localeCompare(b, undefined, { sensitivity: "accent" }) === 0
    : a === b;
}
router.get("/", async (req, res) => {
  if (req.session.user) {
    //Get all the necessary information to load the trending page
    //Load trending page
    res.render("partials/trending", { title: "See what's happening at FilmCult" });
    return;
  } else {
    // Load landing page
    res.render("partials/landing", {
      title: "Join the conversation today at FilmCult"});
    return;
  }
});
router.get("/trending", async (req, res) => {
  if (req.session.user) {
  const postsList = await postsData.getAllPosts();
  postsList.sort((a, b) => (a.postLikes > b.postLikes ? 1 : -1));
  res.render("partials/trending", { title: "trending!", posts: postsList });
  }
  else {
    res.render("partials/landing", {title: "Join the conversation at FilmCult"})
  }
});
router.post("/login", async (req, res) => {
  let found = false;
  const users = await userData.getUsersAll();
  if (req.body.username && req.body.password) {
    if (!req.session.user) {
      for (let i = 0; i < users.length; i++) {
        if (
          users[i].username === req.body.username &&
          bcrypt.compareSync(req.body.password, users[i].password)
        ) {
          found = true;
          req.session.user = users[i]
        }
      }

      if (!found) {
        res
          .status(401)
          .render("partials/landing", {title: "Join the conversation at FilmCult!", loginError: true});
      } else {
        res.redirect("/trending");
      }
    }
  } else {
    res.status(401).render("partials/landing", {title: "Join the conversation at FilmCult!", loginError: true});
  }
});
router.post("/signup", async (req, res) => {
  let found = false;
  if (
    req.body.firstName &&
    req.body.lastName &&
    req.body.userName &&
    req.body.email &&
    req.body.password
  ) {
    const allUsers = await userData.getUsersAll();
    if (allUsers) {
      for (let i = 0; i < allUsers.length; i++) {
        if (
          ciEquals(allUsers[i].username, req.body.username) ||
          ciEquals(allUsers[i].email, req.body.email)
        ) {
          found = true;
          break;
        }
      }
    }
    if (found) {
      res.render("partials/landing", {title: "Join the conversation at FilmCult!", signupError: true });
    } else {
      const user = await userData.createUser(
        req.body.firstName,
        req.body.lastName,
        req.body.userName,
        req.body.email,
        req.body.password
      );
      req.session.user = user;
      res.redirect("/");
    }
  } else {
    res.render("partials/landing", { title: "Join the conversation at FilmCult",signupError: true });
  }
});

router.get("/logout", async (req, res) => {
  try {
    if (!req.session) {
        throw "There is no session"
    }
    if (!req.session.user) {
        throw "You must be logged in before you can make a search"
    }
    req.session.destroy();
    res.redirect("/");
  } catch(e) {
    res.status(500).send(e)
  }
})

// Get user profile page
router.get("/user", async (req, res) => {
  try {
    if (!req.session) {
        throw "There is no session"
    }
    if (!req.session.user) {
        throw "You must be logged in before you can make a search"
    }
    // Add error handling
    let id = req.session.user._id;
    const user = await userData.getUserByID(id);
    // Need to get posts of users
    // Need to get moviesRated of users
    // Need to get REcommendations of users
  res.render("partials/userProfile.handlebars", {title: `${user.username}'s Profile`, user: user})
  } catch(e) {
    res.redirect("partials/landing", {title: "Join the conversation at FilmCult today!"}) 
  }
})

module.exports = router;
