const mainRoutes = require('./main')
const searchRoutes = require('./search')
// Insert separate routes for the different functions

const constructor = (app) => {
    // Add routes with app.use
    app.use("/", mainRoutes)
    app.use("/search", searchRoutes)
    app.use("*", (req,res) => {
        res.status(404).json({error: "Not found"});
    });
};

module.exports = constructor;