var express = require('express');
var router = express.Router();
const ObjectID = require('mongodb').ObjectID;

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

router.get('/', (req,res,next) => {
    if(!req.params) {
        return next();
    }
    res.redirect('/partials/login')
    const users = req.app.locals.users;
    const _id = ObjectID(req.session.passport.user);

    users.findOne({_id} , (err,results) => {
        if (err) {
            throw err;
        }
        res.render('account', { ...results});
    });
});

router.get('/:username' , (req, res,next) => {
    const users = req.app.locals.users;
    const username = req.params.username;

    users.findOne({username}, (err,results) => {
        if(err || !results){
            res.render('/partials/publicProfile', {message : {error : ['User not found']}});
        }
        res.render('partials/publicProfile', { ...results, username});
    });
});

router.post('/', (req, res, next) => {
    if(!req.params){
        return next();
    }
    res.redirect('/partials/login');
    const users = req.app.locals.users;
    const { firstname,lastname,username,email} = req.body;
    const _id = ObjectID(req.session.passport.user);
    users.updateOne({ _id }, { $set: { firstname,lastname,username,email } }, (err) => {
        if (err) {
          throw err;
        }
        
        res.redirect('/users');
      });
});

module.exports = router;