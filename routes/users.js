var express = require('express');
var router = express.Router();
const ObjectID = require('mongodb').ObjectID;
const userMethods = require('../data/users');

router.get('/update', (req,res,next) => {
    if(!req.params) {
        return next();
    }

    const users = req.app.locals.users;
    const _id = ObjectID(req.session.passport.user);
    
    users.findOne({_id} , (err,results) => {
        if (err) {
            throw err;
        }
        res.render('account', { ...results});
    });
});

router.get('/' , (req, res,next) => {
    const users = req.app.locals.users;
    const username = req.params.username;
    console.log(req.session.userId);
    const userId = req.session.user._id;
    try{
        let user =  userMethods.getUserByID(userId);
        res.render('partials/userProfile', {user:user});

    }
    catch(e){

    }
});

router.post('/', (req, res, next) => {
    if(!req.params){
        return next();
    }

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