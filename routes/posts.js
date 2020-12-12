const express = require("express")
const router = express.Router();
const data = require("../data/index")
const movies = data.movies;
const postsData = data.posts;


// This should render a page to create a post
router.get("/movieSelection", async (req, res) => {
    res.render("partials/createPost", {title: "Create a post"})
})
router.post("/", async (req, res) => {
    
})
module.exports = router