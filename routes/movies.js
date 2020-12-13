const express = require("express")
const router = express.Router();
const data = require("../data/index");
const moviesData = data.movies;
const axios = require('axios')
const API_KEY = '2c5709ff90e8aeb0f12febf13b682fa8' 

router.get('/', async (req, res) => {
    res.render('partials/createMovie', {title: "Create a movie"} );
})

// Movie is created from user input
router.post('/', async (req, res) => {
    let data = req.body;
    let addedMovie = {};
    if (req.body.title || req.body.description || req.body.genres || req.body.image || req.body.budget) {
        addedMovie = await moviesData.createMovie(data.title, data.description, data.genres, data.budget, data.image)
    }
    res.render('partials/showDetails', {title: "Show Details", show: addedMovie});

})
// Movie is created from TMDB json object
router.post('/:id', async (req, res) => {
    let tmdbID = req.params.id;
    if (!tmdbID || typeof parseInt(tmdbID) !== 'number') {
        throw `${tmdbID} is not a valid id for TMDB`;
    }
    let movieURL = `https://api.themoviedb.org/3/movie/${tmdbID}?api_key=${API_KEY}`;
    const {data} = await axios.get(movieURL);
    let movieGenres = []
    data.genres.forEach(genre => {
        movieGenres.push(genre.name)
    });;
    // console.log(data)
    if (!data.budget) {
        data.budget = 'N/A';
    }
    let addedMovie = await moviesData.createMovie(data.original_title,data.overview,movieGenres,data.budget,`https://image.tmdb.org/t/p/original${data.poster_path}`);
    res.render('partials/showDetails', {title: "Show Details", show: addedMovie});
})

module.exports = router;