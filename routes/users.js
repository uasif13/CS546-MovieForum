var express = require('express');
var router = express.Router();
const ObjectID = require('mongodb').ObjectID;
const userMethods = require('../data/users');

// Get user profile page
// router.get("/", async (req, res) => {
//   try {
//     if (!req.session) {
//         throw "There is no session"
//     }
//     if (!req.session.user) {
//         throw "You must be logged in before you can make a search"
//     }
//     // Add error handling
//     let id = req.session.user._id;
//     const user = await userData.getUserByID(id);
//     // Need to get posts of users
//     // Need to get moviesRated of users
//     // Need to get REcommendations of users
//   res.render("partials/userProfile.handlebars", {title: `${user.username}'s Profile`, user: user})
//   } catch(e) {
//     res.redirect("partials/landing", {title: "Join the conversation at FilmCult today!"})
//   }
// })

router.get("/update", (req, res, next) => {
  if (!req.params) {
    return next();
  }

  const users = req.app.locals.users;
  const _id = ObjectID(req.session.passport.user);

  users.findOne({ _id }, (err, results) => {
    if (err) {
      throw err;
    }
    res.render("account", { ...results });
  });
});

router.get("/", (req, res, next) => {
  const users = req.app.locals.users;
  const username = req.params.username;
  console.log(req.session.userId);
  const userId = req.session.user._id;
  try {
    let user = userMethods.getUserByID(userId);
    res.render("partials/userProfile", { user: user });
  } catch (e) {}
});

router.post("/", (req, res, next) => {
  if (!req.params) {
    return next();
  }

  const users = req.app.locals.users;
  const { firstname, lastname, username, email } = req.body;
  const _id = ObjectID(req.session.passport.user);
  users.updateOne(
    { _id },
    { $set: { firstname, lastname, username, email } },
    (err) => {
      if (err) {
        throw err;
      }

      res.redirect("/users");
    }
  );
});

module.exports = router;
