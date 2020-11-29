const express = require('express')
const router = express.Router();

router.get('/', async(req, res) => {
    if (req.session.user) {
        //Get all the necessary information to load the trending page
        //Load trending page
        // res.render("partials/trending", {title: ""})
        return;
    } else {
        // Load landing page
        res.render("partials/landing", {title: "Join the conversation today at FilmCult"})
        return;
    }
})

module.exports = router;