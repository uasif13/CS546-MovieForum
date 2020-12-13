const mainRoutes = require('./main')
const searchRoutes = require('./search')
const postsRoutes = require('./posts')
const moviesRoutes = require('./movies')
// Insert separate routes for the different functions

const constructor = (app) => {
    // Add routes with app.use
    app.use("/search", searchRoutes)
    app.use("/posts", postsRoutes)
    app.use("/movies", moviesRoutes)
    app.use("/", mainRoutes)
    app.use("*", (req,res) => {
        res.status(404).json({error: "Not found"});
    });
};

module.exports = constructor;