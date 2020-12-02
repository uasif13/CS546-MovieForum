const express = require("express");
const router = express.Router();
const data = require("../data");
const userData = data.users;
function ciEquals(a, b) {
  return typeof a === "string" && typeof b === "string"
    ? a.localeCompare(b, undefined, { sensitivity: "accent" }) === 0
    : a === b;
}
router.get("/", async (req, res) => {
  if (req.session.user) {
    //Get all the necessary information to load the trending page
    //Load trending page
    res.render("partials/trending", { title: "trending" });
    return;
  } else {
    // Load landing page
    res.render("partials/landing", {
      title: "Join the conversation today at FilmCult",
    });
    return;
  }
});
router.get("/signup", async (req, res) => {
  res.render("partials/signup", { title: "Signup!" });
});
router.post("/login", async (req, res) => {
  let found = false;
  if (req.body.username && req.body.password) {
    if (!req.session.user) {
      for (let i = 0; i < users.length; i++) {
        if (
          users[i].username === req.body.username &&
          bcrypt.compareSync(req.body.password, users[i].hashedPassword)
        ) {
          found = true;
        }
      }

      if (!found) {
        res.status(401).render("login", { error: true, title: "error" });
      } else {
        res.redirect("/trending");
      }
    }
  } else {
    res.status(401).render("login", { error: true, title: "error" });
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
      res.render("partials/signup", { error: true });
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
    res.render("partials/signup", { error: true });
  }
});

module.exports = router;
