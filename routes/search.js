const express = require("express") 
const router = express.Router();
const { ObjectID } = require("mongodb")
const data = require("../data")
const postsData = data.posts;
const moviesData = data.movies;
const userData = data.users;
const commentsData = data.comments;
const spaceRegex = /^\s*$/;
const xss = require("xss")

// Gets the search form page
router.get("/", async (req, res) => {
    try {
        if (!req.session) {
            throw "There is no session"
        }
        if (!req.session.user) {
            throw "You must be logged in before you can make a search"
        }
        res.render("partials/search.handlebars", {title: "Make a search"}) 
    } catch(e) {
        res.status(500).send(e)
    }
});

// Attributes of req.body
// searchItem = Post, Movie, User?
// Keyword

router.post("/", async (req, res) => {
    try {
        if (!req.session) {
            throw "There is no session"
        }
        if (!req.session.user) {
            throw "You must be logged in before you can make a search"
        }
        if (!req.body.searchItem || typeof req.body.searchItem !== 'string') {
            throw "No Search Item was provided";
        }
        if (!req.body.searchQuery) {
            throw "No Seach Query was provided";
        }
        const type = req.body.searchItem;
        if (type !== "post" &&type !== "user" &&type !== "movie"){
            throw "Search Item is not valid"
        }
        if (typeof req.body.searchQuery !== 'string' || spaceRegex.test(req.body.searchQuery)) {
            throw "Search Query is not valid"
        }
        let results = []
        const searchRegex = new RegExp(req.body.searchQuery,"ig")
        if (type == "post") {
            const allPosts = await postsData.getAllPosts();
            results = allPosts.filter(post => searchRegex.test(post.postTitle) || searchRegex.test(post.postBody))
        }
        if (type == "movie") {
            const allMovies = await moviesData.getAllMovies()
            results = allMovies.filter(movie => searchRegex.test(movie.title) || searchRegex.test(movie.description))
        }
        if (type == "user") {
            const allUsers = await userData.getUsersAll()
            results = allUsers.filter(user => searchRegex.test(user.firstName) || searchRegex.test(user.lastName)|| searchRegex.test(user.email)|| searchRegex.test(user.username))
        }
        res.render("partials/searchResults", {title: "Search Results", isPost: type === "post", isMovie: type === "movie", isUser: type === "user", results: results, type: type.toUpperCase(), keyword: req.body.searchQuery.toUpperCase()})
    } catch (e) {
        res.status(500).send(e)

    }

})

// Gets the results from a search
// This has become trivial since post will show the results after a search
// router.get("/result", async(req, res) => {

// })


module.exports = router