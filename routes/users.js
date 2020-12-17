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

    }
    catch(e){

    }
});


router.post("/", async (req, res) => {
    try {
      if (!req.session) {
          throw "There is no session"
      }
      if (!req.session.user) {
          throw "You must be logged in before you can make a update"
      }
      if (!req.body) {
        throw "No body was sent with POST request"
      }
      const data = req.body;
      //console.log(data)
      errorHandlePostCreation(data, req.session.user._id);
      let updateuser = await postsData.createPost(
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
      res.status(500).send(e);
    }
  });

module.exports = router;