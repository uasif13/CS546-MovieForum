const express = require("express")
const router = express.Router();
const data = require("../data/index");
const moviesData = data.movies;

router.get('/', async (req, res) => {
    res.render('partials/createMovie', {title: "Create a movie"} );
})

router.post('/', async (req, res) => {
    let data = req.body;
    let addedMovie = {};
    if (req.body.title || req.body.description || req.body.genres || req.body.image || req.body.budget) {
        addedMovie = await moviesData.createMovie(data.title, data.description, data.genres, data.budget, data.image)
    }
    res.render('partials/showDetails', {title: "Show Details", show: addedMovie});

})

module.exports = router;