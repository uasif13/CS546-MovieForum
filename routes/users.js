var express = require("express");
var router = express.Router();
const ObjectID = require("mongodb").ObjectID;
const userMethods = require("../data/users");
const xss = require("xss");

router.get("/update", async (req, res) => {
  if (!req.params) {
    return next();
  }
  //const users = req.app.locals.users;
  //const _id = ObjectID(req.session.passport.user);
  const userId = req.session.user._id;
  try {
    let user = userMethods.getUserByID(userId);
    res.render("partials/account", { user: user });
  } catch (e) {
    res.send(500).send(e);
  }
});

router.get("/", async (req, res) => {
  const users = req.app.locals.users;
  const username = req.params.username;
  const userId = req.session.user._id;
  try {
    let user = await userMethods.getUserByID(userId);
    res.render("partials/userProfile", { user: user });
  } catch (e) {
    console.log(error);
  }
});

router.post("/", async (req, res) => {
  try {
    if (!req.session) {
      throw "There is no session";
    }
    if (!req.session.user) {
      throw "You must be logged in before you can make a update";
    }
    if (!req.body) {
      throw "No body was sent with POST request";
    }
    const data = req.body;

    try {
      await userMethods.updateUser(
        req.session.user._id,
        data.firstName,
        data.lastName,
        data.userName,
        data.email
      );
    } catch (e) {
      throw e;
    }
    res.redirect("/user");
  } catch (e) {
    res.status(400).render("partials/account", { error: e });
  }
});

module.exports = router;
