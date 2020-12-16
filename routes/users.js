var express = require('express');
var router = express.Router();
const ObjectID = require('mongodb').ObjectID;

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