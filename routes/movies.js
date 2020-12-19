const express = require("express");
const router = express.Router();
const data = require("../data/index");
const moviesData = data.movies;
const postsData = data.posts;
const axios = require("axios");
const movies = require("../data/movies");
const API_KEY = "2c5709ff90e8aeb0f12febf13b682fa8";
const spaceRegex = /^\s*$/;
const xss = require("xss");

// GEt the createMovie page
router.get("/create", async (req, res) => {
  try {
    if (!req.session) {
      throw "There is no session";
    }
    if (!req.session.user) {
      throw "You must be logged in before you can make a search";
    }
    res.render("partials/createMovie", { title: "Create a movie" });
  } catch (e) {
    res.status(500).send(e);
  }
});

// GEt all movies
router.get("/", async (req, res) => {
  try {
    if (!req.session) {
      throw "There is no session";
    }
    if (!req.session.user) {
      throw "You must be logged in before you can see a movie";
    }
    let allMovies = await moviesData.getAllMovies();
    res.json(allMovies);
  } catch (e) {
    // res.status(500).send(e)
    res.redirect("/");
  }
});

router.get("/:id", async (req, res) => {
  try {
    if (!req.session) {
      throw "There is no session";
    }
    if (!req.session.user) {
      throw "You must be logged in before you can make a search";
    }
    let movie = await moviesData.getMovie(req.params.id);
    let postsList = await postsData.getPostforMovie(req.params.id);
    postsList.sort((a, b) => (a.postLikes > b.postLikes ? 1 : -1));
    res.render("partials/moviePage", {
      title: movie.title,
      movie: movie,
      posts: postsList,
    });
  } catch (e) {
    res.status(500).send(e);
  }
});
router.get("/detail/:id", async (req, res) => {
  try {
    if (!req.session) {
      throw "There is no session";
    }
    if (!req.session.user) {
      throw "You must be logged in before you can make a search";
    }
    let movie = await moviesData.getMovie(req.params.id);
    res.render("partials/showDetails", {
      title: "Show Details",
      show: movie,
    });
  } catch (e) {
    res.status(500).send(e);
  }
});

// Movie is created from user input
router.post("/", async (req, res) => {
  try {
    if (!req.session) {
      throw "There is no session";
    }
    if (!req.session.user) {
      throw "You must be logged in before you can make a search";
    }
    if (!req.body) {
      throw "No body was sent with POST request";
    }
    let data = req.body;
    let addedMovie = {};
    if (
      req.body.title &&
      req.body.description &&
      req.body.genres &&
      req.body.image &&
      req.body.budget
    ) {
      data.genres.forEach((genre) => {
        xss(genre);
      });
      addedMovie = await moviesData.createMovie(
        xss(data.title),
        xss(data.description),
        data.genres,
        xss(data.budget),
        xss(data.image)
      );
    }
    res.render("partials/showDetails", {
      title: "Show Details",
      show: addedMovie,
    });
  } catch (e) {
    res.status(500).send(e);
  }
});
// Movie is created from TMDB json object
// This is extra. I will save this if I plan to do this in future. Since it's not on the extra or required feature, its not needed
// router.post('/:id', async (req, res) => {
//     let tmdbID = req.params.id;
//     if (!tmdbID || typeof parseInt(tmdbID) !== 'number') {
//         throw `${tmdbID} is not a valid id for TMDB`;
//     }
//     let movieURL = `https://api.themoviedb.org/3/movie/${tmdbID}?api_key=${API_KEY}`;
//     const {data} = await axios.get(movieURL);
//     let movieGenres = []
//     data.genres.forEach(genre => {
//         movieGenres.push(genre.name)
//     });;
//     // console.log(data)
//     if (!data.budget) {
//         data.budget = 'N/A';
//     }
//     let addedMovie = await moviesData.createMovie(data.original_title,data.overview,movieGenres,data.budget,`https://image.tmdb.org/t/p/original${data.poster_path}`);
//     res.render('partials/showDetails', {title: "Show Details", show: addedMovie});
// })

module.exports = router;
