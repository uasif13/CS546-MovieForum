var express = require('express');
var router = express.Router();
const ObjectID = require('mongodb').ObjectID;
const userMethods = require('../data/users');


router.get('/update', (req,res,next) => {
    if(!req.params) {
        return next();
    }
    //const users = req.app.locals.users;
    //const _id = ObjectID(req.session.passport.user);
    const userId = req.session.user._id;
    try{
        let user = userMethods.getUserByID(userId);
        res.render('partials/account', {user:user});
    }
     catch(e){
     }   
});

router.get('/' , (req, res,next) => {
    const users = req.app.locals.users;
    const username = req.params.username;
    //console.log(req.session.userId);
    const userId = req.session.user._id;
    try{
        let user =  userMethods.getUserByID(userId);
        res.render('partials/userProfile', {user:user});



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



router.post('/', (req, res, next) => {
    if(!req.params){
        return next();
    }




      res.redirect("/users");
    }
  );
});

module.exports = router;
